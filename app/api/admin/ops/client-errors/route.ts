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
  const type = searchParams.get("type")?.trim().toLowerCase();
  const url = searchParams.get("url")?.trim();
  const { page, pageSize, offset } = parsePagination(searchParams, { pageSize: 20, maxPageSize: 100 });

  const db = getDb();

  const values: Array<string | number> = [];
  const where: string[] = [];

  if (type) {
    values.push(type);
    where.push(`lower(error_type) = $${values.length}`);
  }

  if (url) {
    values.push(url);
    where.push(`url ilike '%' || $${values.length} || '%'`);
  }

  const whereClause = where.length > 0 ? `where ${where.join(" and ")}` : "";

  const listSql = `
    select id, error_type, message, url, stack, event_timestamp, created_at, metadata
    from client_error_events
    ${whereClause}
    order by created_at desc
    limit $${values.length + 1}
    offset $${values.length + 2};
  `;

  const countSql = `
    select count(*)::int as total
    from client_error_events
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
    action: "ops_client_errors_list",
    targetType: "client_error_events",
    status: "success",
    metadata: { page, pageSize, total, typeFilter: type ?? null, urlFilter: url ?? null },
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
