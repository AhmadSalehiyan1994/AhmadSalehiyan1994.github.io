import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { validateCsrf } from "@/lib/csrf";
import { parseBody, topicFollowSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getVerifiedMemberSession();

  if (!session.memberId) {
    return NextResponse.json({ ok: false, error: { code: "AUTH_REQUIRED", message: "Sign in required." } }, { status: 401 });
  }

  if (!validateCsrf(request)) {
    return NextResponse.json({ ok: false, error: { code: "INVALID_CSRF", message: "Invalid CSRF token." } }, { status: 403 });
  }

  const parsed = await parseBody(request, topicFollowSchema);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "INVALID_TOPIC", message: "Topic is required." } }, { status: 400 });
  }

  const topicSlug = parsed.data.topicSlug.trim();

  const db = getDb();
  await db.query(
    `
      insert into poll_topic_follows (member_id, topic_slug)
      values ($1, $2)
      on conflict do nothing;
    `,
    [session.memberId, topicSlug],
  );

  return NextResponse.json({ ok: true, data: { followed: true, topicSlug } });
}
