import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { parseBody, bootstrapAdminSchema } from "@/lib/validation";
import { writeAdminAuditLog } from "@/lib/audit-log";

export async function POST(request: Request) {
  try {
    const bootstrapKey = process.env.BOOTSTRAP_ADMIN_KEY;
    const providedKey = request.headers.get("x-bootstrap-key") || "";

    if (!bootstrapKey) {
      await writeAdminAuditLog({
        actorRole: "system",
        action: "bootstrap_admin",
        status: "failed",
        metadata: { reason: "bootstrap_disabled" },
      });
      return NextResponse.json(
        {
          ok: false,
          error: { code: "BOOTSTRAP_DISABLED", message: "Bootstrap route is disabled." },
        },
        { status: 403 },
      );
    }

    if (providedKey !== bootstrapKey) {
      await writeAdminAuditLog({
        actorRole: "system",
        action: "bootstrap_admin",
        status: "failed",
        metadata: { reason: "invalid_bootstrap_key" },
      });
      return NextResponse.json(
        {
          ok: false,
          error: { code: "INVALID_BOOTSTRAP_KEY", message: "Invalid bootstrap key." },
        },
        { status: 401 },
      );
    }

    const parsed = await parseBody(request, bootstrapAdminSchema);
    if (!parsed.success) {
      await writeAdminAuditLog({
        actorRole: "system",
        action: "bootstrap_admin",
        status: "failed",
        metadata: { reason: "invalid_input" },
      });
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "INVALID_INPUT",
            message: "fullName, email, and password (>=8 chars) are required.",
          },
        },
        { status: 400 },
      );
    }

    const fullName = parsed.data.fullName.trim();
    const email = parsed.data.email.trim().toLowerCase();
    const password = parsed.data.password;

    const db = getDb();

    const existingAdmins = await db.query(
      `
        select count(*)::int as total
        from members
        where role = 'admin';
      `,
    );

    const totalAdmins = existingAdmins.rows[0]?.total ?? 0;
    if (totalAdmins > 0) {
      await writeAdminAuditLog({
        actorRole: "system",
        action: "bootstrap_admin",
        status: "failed",
        metadata: { reason: "admin_already_exists", email },
      });
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "ADMIN_ALREADY_EXISTS",
            message: "An admin already exists. Bootstrap route can no longer create one.",
          },
        },
        { status: 409 },
      );
    }

    const emailExists = await db.query("select id from members where email = $1 limit 1", [email]);
    if ((emailExists.rowCount ?? 0) > 0) {
      await writeAdminAuditLog({
        actorRole: "system",
        action: "bootstrap_admin",
        status: "failed",
        metadata: { reason: "email_exists", email },
      });
      return NextResponse.json(
        {
          ok: false,
          error: { code: "EMAIL_EXISTS", message: "Email already exists." },
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const inserted = await db.query(
      `
        insert into members (full_name, email, password_hash, role)
        values ($1, $2, $3, 'admin')
        returning id, full_name, email, role, created_at;
      `,
      [fullName, email, passwordHash],
    );

    await writeAdminAuditLog({
      actorMemberId: inserted.rows[0].id,
      actorRole: "admin",
      action: "bootstrap_admin",
      targetType: "member",
      targetId: inserted.rows[0].id,
      status: "success",
      metadata: { email },
    });

    return NextResponse.json({
      ok: true,
      data: {
        admin: inserted.rows[0],
      },
    });
  } catch (error) {
    await writeAdminAuditLog({
      actorRole: "system",
      action: "bootstrap_admin",
      status: "failed",
      metadata: { reason: error instanceof Error ? error.message : "unknown" },
    });
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "BOOTSTRAP_FAILED",
          message: "Unable to bootstrap admin.",
          details: error instanceof Error ? error.message : undefined,
        },
      },
      { status: 500 },
    );
  }
}
