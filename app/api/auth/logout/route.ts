import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearAuthCookies, verifySessionToken } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST() {
  const token = cookies().get("member_session")?.value;
  if (token) {
    const decoded = verifySessionToken(token);
    if (decoded?.sub) {
      try {
        const db = getDb();
        await db.query(
          `
            update members
            set token_revoked_before = now(), session_version = session_version + 1, updated_at = now()
            where id = $1;
          `,
          [decoded.sub],
        );
      } catch {
        // best-effort revocation
      }
    }
  }

  const response = NextResponse.json({ ok: true, data: { loggedOut: true } });
  clearAuthCookies(response);
  return response;
}
