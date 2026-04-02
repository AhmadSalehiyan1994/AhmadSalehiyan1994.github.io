import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { validateCsrf } from "@/lib/csrf";
import { parseBody, voteSchema } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: { pollId: string } }) {
  const session = await getVerifiedMemberSession();

  if (!session.memberId) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "AUTH_REQUIRED",
          message: "Please sign in to vote.",
        },
      },
      { status: 401 },
    );
  }

  if (!validateCsrf(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INVALID_CSRF",
          message: "Security validation failed.",
        },
      },
      { status: 403 },
    );
  }

  try {
    const db = getDb();
    const parsed = await parseBody(request, voteSchema);
    const optionIds: number[] = parsed.success ? parsed.data.optionIds : [];

    if (optionIds.length === 0 || optionIds.some((value) => !Number.isInteger(value))) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_OPTIONS",
            message: "Select at least one valid option.",
          },
        },
        { status: 400 },
      );
    }

    const pollClient = await db.connect();

    try {
      await pollClient.query("begin");

      const pollResult = await pollClient.query(
        `
          select id, status, starts_at, ends_at, allow_multiple, max_choices
          from polls
          where id = $1;
        `,
        [params.pollId],
      );

      if (pollResult.rowCount === 0) {
        await pollClient.query("rollback");
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "POLL_NOT_FOUND",
              message: "Poll not found.",
            },
          },
          { status: 404 },
        );
      }

      const poll = pollResult.rows[0];
      const now = new Date();

      if (poll.status !== "active" || (poll.starts_at && now < poll.starts_at) || (poll.ends_at && now > poll.ends_at)) {
        await pollClient.query("rollback");
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "POLL_INACTIVE",
              message: "This poll is not currently accepting votes.",
            },
          },
          { status: 409 },
        );
      }

      if (!poll.allow_multiple && optionIds.length > 1) {
        await pollClient.query("rollback");
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "MULTI_NOT_ALLOWED",
              message: "This poll allows only one choice.",
            },
          },
          { status: 400 },
        );
      }

      if (poll.allow_multiple && poll.max_choices && optionIds.length > poll.max_choices) {
        await pollClient.query("rollback");
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "TOO_MANY_CHOICES",
              message: `You can select up to ${poll.max_choices} options.`,
            },
          },
          { status: 400 },
        );
      }

      const validOptions = await pollClient.query(
        `
          select id
          from poll_options
          where poll_id = $1 and id = any($2::int[]);
        `,
        [params.pollId, optionIds],
      );

      if (validOptions.rowCount !== optionIds.length) {
        await pollClient.query("rollback");
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "OPTION_MISMATCH",
              message: "Some selected options are invalid.",
            },
          },
          { status: 400 },
        );
      }

      const ballotResult = await pollClient.query(
        `
          insert into poll_ballots (poll_id, member_id)
          values ($1, $2)
          on conflict (poll_id, member_id) do nothing
          returning id;
        `,
        [params.pollId, session.memberId],
      );

      if (ballotResult.rowCount === 0) {
        await pollClient.query("rollback");
        return NextResponse.json(
          {
            ok: false,
            error: {
              code: "ALREADY_VOTED",
              message: "You have already voted in this poll.",
            },
          },
          { status: 409 },
        );
      }

      const ballotId = ballotResult.rows[0].id;

      for (const optionId of optionIds) {
        await pollClient.query(
          `
            insert into poll_ballot_choices (ballot_id, poll_option_id)
            values ($1, $2)
            on conflict do nothing;
          `,
          [ballotId, optionId],
        );
      }

      await pollClient.query(
        `
          insert into poll_notifications (member_id, type, title, body, metadata)
          values ($1, 'vote_recorded', 'Vote recorded', 'Your poll vote was submitted successfully.', jsonb_build_object('pollId', $2));
        `,
        [session.memberId, params.pollId],
      );

      await pollClient.query(
        `
          with first_vote as (
            select count(*)::int as total_votes
            from poll_ballots
            where member_id = $1
          ), badge as (
            select id
            from poll_badges
            where slug = 'early-voter'
            limit 1
          )
          insert into member_badges (member_id, badge_id, reason)
          select $1, badge.id, 'Submitted first poll vote'
          from badge, first_vote
          where first_vote.total_votes = 1
          on conflict do nothing;
        `,
        [session.memberId],
      );

      await pollClient.query("commit");

      return NextResponse.json({ ok: true, data: { voted: true } });
    } catch (error) {
      await pollClient.query("rollback");
      throw error;
    } finally {
      pollClient.release();
    }
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "VOTE_FAILED",
          message: "Unable to submit vote.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
