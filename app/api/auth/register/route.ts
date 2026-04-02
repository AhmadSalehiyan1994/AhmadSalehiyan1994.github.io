import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createCsrfToken, setAuthCookies, signSessionToken } from "@/lib/auth";
import { parseBody, registerSchema } from "@/lib/validation";
import { enforceDbRateLimit } from "@/lib/rate-limit";

function getClientId(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, registerSchema);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "INVALID_INPUT", message: "Full name, email, and 8+ char password are required." },
        },
        { status: 400 },
      );
    }

    const fullName = parsed.data.fullName.trim();
    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const limiter = await enforceDbRateLimit({
      routeKey: "auth-register",
      subjectKey: `${getClientId(request)}:${email}`,
      windowSeconds: 60,
      maxHits: 8,
    });

    if (limiter.limited) {
      return NextResponse.json(
        { ok: false, error: { code: "RATE_LIMITED", message: "Too many register attempts. Try again soon." } },
        { status: 429 },
      );
    }

    const db = getDb();
    const existing = await db.query("select id from members where email = $1", [email]);
    if ((existing.rowCount ?? 0) > 0) {
      return NextResponse.json(
        { ok: false, error: { code: "EMAIL_EXISTS", message: "Email is already registered." } },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const created = await db.query(
      `
        insert into members (full_name, email, password_hash, role)
        values ($1, $2, $3, 'member')
        returning id, full_name, email, role, session_version;
      `,
      [fullName, email, passwordHash],
    );

    const member = created.rows[0];
    const token = signSessionToken({
      sub: member.id,
      role: member.role,
      email: member.email,
      name: member.full_name,
      sessionVersion: Number(member.session_version ?? 1),
    });
    const csrfToken = createCsrfToken();

    const response = NextResponse.json({
      ok: true,
      data: {
        member: {
          id: member.id,
          fullName: member.full_name,
          email: member.email,
          role: member.role,
        },
      },
    });

    setAuthCookies(response, token, csrfToken);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "REGISTER_FAILED",
          message: "Unable to register now.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
