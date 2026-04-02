import { NextResponse } from "next/server";
import { getVerifiedMemberSession } from "@/lib/member-session";

export async function GET() {
  const session = await getVerifiedMemberSession();

  if (!session.memberId) {
    return NextResponse.json({ ok: true, data: { authenticated: false, member: null } });
  }

  return NextResponse.json({
    ok: true,
    data: {
      authenticated: true,
      member: {
        id: session.memberId,
        role: session.role,
        email: session.email,
        name: session.name,
      },
    },
  });
}
