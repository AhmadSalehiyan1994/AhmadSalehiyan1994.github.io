import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { parsePagination } from "@/lib/pagination";
import { writeAdminAuditLog } from "@/lib/audit-log";

export async function GET(request: Request) {
  const session = await getVerifiedMemberSession();

  if (session.role !== "admin") {
    return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Admin required." } }, { status: 403 });
  }

  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const { page, pageSize, offset } = parsePagination(searchParams, { pageSize: 20, maxPageSize: 100 });

    const rows = await db.query(
      `
        select
          c.id,
          c.body,
          c.status,
          c.created_at,
          c.poll_id,
          p.title as poll_title,
          m.full_name as member_name,
          m.email as member_email
        from poll_comments c
        join polls p on p.id = c.poll_id
        join members m on m.id = c.member_id
        where c.status = 'pending'
        order by c.created_at asc
        limit $1
        offset $2;
      `,
      [pageSize, offset],
    );

    const count = await db.query(
      `
        select count(*)::int as total
        from poll_comments
        where status = 'pending';
      `,
    );

    const total = Number(count.rows[0]?.total ?? 0);

    await writeAdminAuditLog({
      actorMemberId: session.memberId,
      actorRole: session.role,
      action: "pending_comments_list",
      targetType: "poll_comments",
      status: "success",
      metadata: { page, pageSize, total },
    });

    return NextResponse.json({
      ok: true,
      data: rows.rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    await writeAdminAuditLog({
      actorMemberId: session.memberId,
      actorRole: session.role,
      action: "pending_comments_list",
      targetType: "poll_comments",
      status: "failed",
      metadata: { reason: error instanceof Error ? error.message : "unknown" },
    });
    return NextResponse.json(
      { ok: false, error: { code: "PENDING_COMMENTS_FAILED", message: "Unable to load pending comments." } },
      { status: 500 },
    );
  }
}
