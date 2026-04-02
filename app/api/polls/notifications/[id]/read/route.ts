import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { validateCsrf } from "@/lib/csrf";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getVerifiedMemberSession();

  if (!session.memberId) {
    return NextResponse.json({ ok: false, error: { code: "AUTH_REQUIRED", message: "Sign in required." } }, { status: 401 });
  }

  if (!validateCsrf(request)) {
    return NextResponse.json({ ok: false, error: { code: "INVALID_CSRF", message: "Invalid CSRF token." } }, { status: 403 });
  }

  const db = getDb();
  const result = await db.query(
    `
      update poll_notifications
      set is_read = true
      where id = $1 and member_id = $2
      returning id, is_read;
    `,
    [params.id, session.memberId],
  );

  if ((result.rowCount ?? 0) === 0) {
    return NextResponse.json({ ok: false, error: { code: "NOTIFICATION_NOT_FOUND", message: "Notification not found." } }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: result.rows[0] });
}
