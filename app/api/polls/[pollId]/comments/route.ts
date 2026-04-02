import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { validateCsrf } from "@/lib/csrf";
import { commentCreateSchema, parseBody } from "@/lib/validation";
import { parsePagination } from "@/lib/pagination";

export async function GET(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const { page, pageSize, offset } = parsePagination(searchParams, { pageSize: 20, maxPageSize: 100 });

    const comments = await db.query(
      `
        select
          c.id,
          c.body,
          c.status,
          c.created_at,
          m.full_name as author_name
        from poll_comments c
        join members m on m.id = c.member_id
        where c.poll_id = $1 and c.status = 'approved'
        order by c.created_at desc
        limit $2
        offset $3;
      `,
      [params.pollId, pageSize, offset],
    );

    const count = await db.query(
      `
        select count(*)::int as total
        from poll_comments
        where poll_id = $1 and status = 'approved';
      `,
      [params.pollId],
    );

    const total = Number(count.rows[0]?.total ?? 0);

    return NextResponse.json({
      ok: true,
      data: comments.rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "COMMENT_LIST_FAILED",
          message: "Unable to load comments.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: { params: { pollId: string } }) {
  const session = await getVerifiedMemberSession();

  if (!session.memberId) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "AUTH_REQUIRED", message: "Please sign in to comment." },
      },
      { status: 401 },
    );
  }

  if (!validateCsrf(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: { code: "INVALID_CSRF", message: "Security validation failed." },
      },
      { status: 403 },
    );
  }

  try {
    const parsed = await parseBody(request, commentCreateSchema);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "INVALID_COMMENT", message: "Comment must be between 5 and 500 characters." },
        },
        { status: 400 },
      );
    }

    const text = parsed.data.body.trim();

    const db = getDb();

    const result = await db.query(
      `
        insert into poll_comments (poll_id, member_id, body, status)
        values ($1, $2, $3, 'pending')
        returning id, body, status, created_at;
      `,
      [params.pollId, session.memberId, text],
    );

    return NextResponse.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "COMMENT_CREATE_FAILED",
          message: "Unable to post comment.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
