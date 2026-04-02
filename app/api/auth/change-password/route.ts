import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { validateCsrf } from "@/lib/csrf";
import { changePasswordSchema, parseBody } from "@/lib/validation";
import { createCsrfToken, setAuthCookies, signSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getVerifiedMemberSession();

  if (!session.memberId) {
    return NextResponse.json(
      { ok: false, error: { code: "AUTH_REQUIRED", message: "Please sign in first." } },
      { status: 401 },
    );
  }

  if (!validateCsrf(request)) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_CSRF", message: "Security validation failed." } },
      { status: 403 },
    );
  }

  const parsed = await parseBody(request, changePasswordSchema);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_INPUT", message: "Current and new password are required." } },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  if (currentPassword === newPassword) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_INPUT", message: "New password must be different." } },
      { status: 400 },
    );
  }

  const db = getDb();
  const memberResult = await db.query(
    `
      select id, full_name, email, role, password_hash, session_version
      from members
      where id = $1
      limit 1;
    `,
    [session.memberId],
  );

  if ((memberResult.rowCount ?? 0) === 0) {
    return NextResponse.json(
      { ok: false, error: { code: "MEMBER_NOT_FOUND", message: "Account not found." } },
      { status: 404 },
    );
  }

  const member = memberResult.rows[0];
  const validCurrent = await bcrypt.compare(currentPassword, member.password_hash);

  if (!validCurrent) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_CREDENTIALS", message: "Current password is incorrect." } },
      { status: 401 },
    );
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const updated = await db.query(
    `
      update members
      set
        password_hash = $2,
        session_version = session_version + 1,
        token_revoked_before = now(),
        updated_at = now()
      where id = $1
      returning id, full_name, email, role, session_version;
    `,
    [session.memberId, passwordHash],
  );

  const nextMember = updated.rows[0];

  const token = signSessionToken({
    sub: nextMember.id,
    role: nextMember.role,
    email: nextMember.email,
    name: nextMember.full_name,
    sessionVersion: Number(nextMember.session_version),
  });

  const csrfToken = createCsrfToken();

  const response = NextResponse.json({ ok: true, data: { passwordUpdated: true } });
  setAuthCookies(response, token, csrfToken);

  return response;
}
