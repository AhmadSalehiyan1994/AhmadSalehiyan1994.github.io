import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getVerifiedMemberSession } from "@/lib/member-session";
import { validateCsrf } from "@/lib/csrf";
import { parseBody, commentModerateSchema } from "@/lib/validation";
import { writeAdminAuditLog } from "@/lib/audit-log";

export async function POST(request: Request, { params }: { params: { commentId: string } }) {
  const session = await getVerifiedMemberSession();

  if (session.role !== "admin") {
    return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Admin required." } }, { status: 403 });
  }

  if (!validateCsrf(request)) {
    return NextResponse.json({ ok: false, error: { code: "INVALID_CSRF", message: "Invalid CSRF token." } }, { status: 403 });
  }

  try {
    const parsed = await parseBody(request, commentModerateSchema);
    if (!parsed.success) {
      await writeAdminAuditLog({
        actorMemberId: session.memberId,
        actorRole: session.role,
        action: "comment_moderate",
        targetType: "poll_comment",
        targetId: params.commentId,
        status: "failed",
        metadata: { reason: "invalid_action" },
      });
      return NextResponse.json({ ok: false, error: { code: "INVALID_ACTION", message: "Action must be approve/reject/hide." } }, { status: 400 });
    }

    const action = parsed.data.action;
    const nextStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "hidden";

    const db = getDb();
    const updated = await db.query(
      `
        update poll_comments
        set status = $1, updated_at = now()
        where id = $2
        returning id, status;
      `,
      [nextStatus, params.commentId],
    );

    if ((updated.rowCount ?? 0) === 0) {
      return NextResponse.json({ ok: false, error: { code: "COMMENT_NOT_FOUND", message: "Comment not found." } }, { status: 404 });
    }

    await writeAdminAuditLog({
      actorMemberId: session.memberId,
      actorRole: session.role,
      action: "comment_moderate",
      targetType: "poll_comment",
      targetId: params.commentId,
      status: "success",
      metadata: { action, nextStatus },
    });

    return NextResponse.json({ ok: true, data: updated.rows[0] });
  } catch (error) {
    await writeAdminAuditLog({
      actorMemberId: session.memberId,
      actorRole: session.role,
      action: "comment_moderate",
      targetType: "poll_comment",
      targetId: params.commentId,
      status: "failed",
      metadata: { reason: error instanceof Error ? error.message : "unknown" },
    });
    return NextResponse.json({ ok: false, error: { code: "COMMENT_MODERATE_FAILED", message: "Unable to moderate comment." } }, { status: 500 });
  }
}
