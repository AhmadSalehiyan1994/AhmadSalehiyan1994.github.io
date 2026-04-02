import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createCsrfToken, setAuthCookies, signSessionToken } from "@/lib/auth";
import { parseBody, loginSchema } from "@/lib/validation";
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
    const parsed = await parseBody(request, loginSchema);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "INVALID_INPUT", message: "Email and password are required." },
        },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const limiter = await enforceDbRateLimit({
      routeKey: "auth-login",
      subjectKey: `${getClientId(request)}:${email}`,
      windowSeconds: 60,
      maxHits: 12,
    });

    if (limiter.limited) {
      return NextResponse.json(
        { ok: false, error: { code: "RATE_LIMITED", message: "Too many login attempts. Try again soon." } },
        { status: 429 },
      );
    }

    const db = getDb();
    const result = await db.query(
      `
        select id, full_name, email, role, password_hash, is_active
             , session_version
        from members
        where email = $1
        limit 1;
      `,
      [email],
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials." } },
        { status: 401 },
      );
    }

    const member = result.rows[0];

    if (!member.is_active) {
      return NextResponse.json(
        { ok: false, error: { code: "ACCOUNT_DISABLED", message: "This account is disabled." } },
        { status: 403 },
      );
    }

    const validPassword = await bcrypt.compare(password, member.password_hash);
    if (!validPassword) {
      return NextResponse.json(
        { ok: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials." } },
        { status: 401 },
      );
    }

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
          code: "LOGIN_FAILED",
          message: "Unable to sign in now.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
