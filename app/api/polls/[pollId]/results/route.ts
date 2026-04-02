import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";

export async function GET(_request: Request, { params }: { params: { pollId: string } }) {
  try {
    const db = getDb();
    const session = await getVerifiedMemberSession();

    const pollResult = await db.query(
      `
        select id, title, status, results_visibility
        from polls
        where id = $1;
      `,
      [params.pollId],
    );

    if (pollResult.rowCount === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "POLL_NOT_FOUND", message: "Poll not found." },
        },
        { status: 404 },
      );
    }

    const poll = pollResult.rows[0];

    const ballotCheck = session.memberId
      ? await db.query(
          `
            select 1
            from poll_ballots
            where poll_id = $1 and member_id = $2;
          `,
          [params.pollId, session.memberId],
        )
      : { rowCount: 0 };

    const hasVoted = Number(ballotCheck.rowCount ?? 0) > 0;

    const canViewResults =
      poll.results_visibility === "public" ||
      (poll.results_visibility === "after_vote" && hasVoted) ||
      (poll.results_visibility === "after_close" && poll.status === "closed") ||
      session.role === "admin";

    if (!canViewResults) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "RESULTS_LOCKED",
            message: "Results are not visible yet.",
          },
        },
        { status: 403 },
      );
    }

    const results = await db.query(
      `
        with totals as (
          select count(*)::int as total_ballots
          from poll_ballots
          where poll_id = $1
        )
        select
          o.id,
          o.label,
          count(bc.poll_option_id)::int as votes,
          case
            when (select total_ballots from totals) = 0 then 0
            else round((count(bc.poll_option_id)::numeric / (select total_ballots from totals)::numeric) * 100, 2)
          end as pct
        from poll_options o
        left join poll_ballot_choices bc on bc.poll_option_id = o.id
        where o.poll_id = $1
        group by o.id
        order by o.position;
      `,
      [params.pollId],
    );

    return NextResponse.json({
      ok: true,
      data: {
        pollId: params.pollId,
        title: poll.title,
        status: poll.status,
        hasVoted,
        results: results.rows,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "RESULTS_FETCH_FAILED",
          message: "Unable to fetch poll results.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
