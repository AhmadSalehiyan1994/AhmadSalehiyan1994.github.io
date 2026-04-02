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

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const { page, pageSize, offset } = parsePagination(searchParams, { pageSize: 20, maxPageSize: 100 });

  const db = getDb();

  const values: Array<string | number> = [];
  const where: string[] = [];

  if (email) {
    values.push(email);
    where.push(`lower(email) like '%' || $${values.length} || '%'`);
  }

  const whereClause = where.length > 0 ? `where ${where.join(" and ")}` : "";

  const listSql = `
    select id, full_name, email, subject, message, source, submitted_at
    from contact_submissions
    ${whereClause}
    order by submitted_at desc
    limit $${values.length + 1}
    offset $${values.length + 2};
  `;

  const countSql = `
    select count(*)::int as total
    from contact_submissions
    ${whereClause};
  `;

  const [list, count] = await Promise.all([
    db.query(listSql, [...values, pageSize, offset]),
    db.query(countSql, values),
  ]);

  const total = Number(count.rows[0]?.total ?? 0);

  await writeAdminAuditLog({
    actorMemberId: session.memberId,
    actorRole: session.role,
    action: "ops_contact_list",
    targetType: "contact_submissions",
    status: "success",
    metadata: { page, pageSize, total, emailFilter: email ?? null },
  });

  return NextResponse.json({
    ok: true,
    data: list.rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    },
  });
}
