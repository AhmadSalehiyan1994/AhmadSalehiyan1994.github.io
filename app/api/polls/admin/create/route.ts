import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { validateCsrf } from "@/lib/csrf";
import { parseBody, pollCreateSchema } from "@/lib/validation";
import { writeAdminAuditLog } from "@/lib/audit-log";

type PollOptionInput = { label: string };

type CreatePollBody = {
  slug: string;
  title: string;
  description?: string;
  allowMultiple?: boolean;
  maxChoices?: number;
  startsAt?: string;
  endsAt?: string;
  status?: "draft" | "scheduled" | "active";
  options: PollOptionInput[];
  topics?: string[];
  targets?: { targetType: "global" | "article" | "topic"; targetKey: string }[];
  isFeatured?: boolean;
};

export async function POST(request: Request) {
  const session = await getVerifiedMemberSession();

  if (session.role !== "admin") {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "FORBIDDEN", message: "Admin access required." },
      },
      { status: 403 },
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
    const parsed = await parseBody(request, pollCreateSchema);

    if (!parsed.success) {
      await writeAdminAuditLog({
        actorMemberId: session.memberId,
        actorRole: session.role,
        action: "poll_create",
        status: "failed",
        metadata: { reason: "invalid_payload" },
      });
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_PAYLOAD",
            message: "Slug, title, and at least two options are required.",
          },
        },
        { status: 400 },
      );
    }

    const body = parsed.data as CreatePollBody;

    const client = await db.connect();

    try {
      await client.query("begin");

      const pollInsert = await client.query(
        `
          insert into polls (
            slug, title, description, status, visibility, results_visibility,
            allow_multiple, max_choices, starts_at, ends_at, is_featured, created_by
          )
          values (
            $1, $2, $3, coalesce($4, 'draft'), 'members', 'after_vote',
            coalesce($5, false), $6, $7, $8, coalesce($9, false), $10
          )
          returning id;
        `,
        [
          body.slug,
          body.title,
          body.description ?? null,
          body.status ?? "draft",
          body.allowMultiple ?? false,
          body.maxChoices ?? null,
          body.startsAt ?? null,
          body.endsAt ?? null,
          body.isFeatured ?? false,
          session.memberId,
        ],
      );

      const pollId = pollInsert.rows[0].id as string;

      for (let idx = 0; idx < body.options.length; idx += 1) {
        const option = body.options[idx];
        await client.query(
          `
            insert into poll_options (poll_id, label, position)
            values ($1, $2, $3);
          `,
          [pollId, option.label, idx + 1],
        );
      }

      if (Array.isArray(body.topics)) {
        for (const topicSlug of body.topics) {
          await client.query(
            `
              insert into poll_topics (poll_id, topic_slug)
              values ($1, $2)
              on conflict do nothing;
            `,
            [pollId, topicSlug],
          );
        }
      }

      if (Array.isArray(body.targets) && body.targets.length > 0) {
        for (const target of body.targets) {
          await client.query(
            `
              insert into poll_targets (poll_id, target_type, target_key)
              values ($1, $2, $3)
              on conflict do nothing;
            `,
            [pollId, target.targetType, target.targetKey],
          );
        }
      } else {
        await client.query(
          `
            insert into poll_targets (poll_id, target_type, target_key)
            values ($1, 'global', 'global')
            on conflict do nothing;
          `,
          [pollId],
        );
      }

      await client.query("commit");

      await writeAdminAuditLog({
        actorMemberId: session.memberId,
        actorRole: session.role,
        action: "poll_create",
        targetType: "poll",
        targetId: pollId,
        status: "success",
        metadata: { slug: body.slug, title: body.title },
      });

      return NextResponse.json({ ok: true, data: { pollId } });
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    await writeAdminAuditLog({
      actorMemberId: session.memberId,
      actorRole: session.role,
      action: "poll_create",
      status: "failed",
      metadata: { reason: error instanceof Error ? error.message : "unknown" },
    });
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "POLL_CREATE_FAILED",
          message: "Unable to create poll.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
