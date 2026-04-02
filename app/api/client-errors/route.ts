import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { enforceDbRateLimit } from "@/lib/rate-limit";
import { clientErrorSchema, parseBody } from "@/lib/validation";
import { sendAlertWebhook } from "@/lib/alerts";

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown";

    const limiter = await enforceDbRateLimit({
      routeKey: "client-errors",
      subjectKey: ipAddress,
      windowSeconds: 60,
      maxHits: 30,
    });

    if (limiter.limited) {
      return NextResponse.json({ ok: false, error: { code: "RATE_LIMITED" } }, { status: 429 });
    }

    const parsed = await parseBody(request, clientErrorSchema);
    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const payload = parsed.data;
    const db = getDb();

    const userAgent = request.headers.get("user-agent");
    const rawTimestamp = typeof payload?.timestamp === "string" || typeof payload?.timestamp === "number" ? payload.timestamp : null;
    const eventTimestamp = rawTimestamp ? new Date(rawTimestamp) : null;

    const metadata =
      payload && typeof payload === "object"
        ? {
            fileName: typeof payload.fileName === "string" ? payload.fileName : undefined,
            line: typeof payload.line === "number" ? payload.line : undefined,
            column: typeof payload.column === "number" ? payload.column : undefined,
            ...(payload.metadata && typeof payload.metadata === "object" ? { ...payload.metadata } : {}),
          }
        : {};

    await db.query(
      `
        insert into client_error_events (
          error_type,
          message,
          url,
          stack,
          user_agent,
          ip_address,
          event_timestamp,
          metadata
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb);
      `,
      [
        typeof payload?.type === "string" ? payload.type : null,
        typeof payload?.message === "string" ? payload.message : null,
        typeof payload?.url === "string" ? payload.url : null,
        typeof payload?.stack === "string" ? payload.stack : null,
        userAgent,
        ipAddress,
        eventTimestamp && !Number.isNaN(eventTimestamp.getTime()) ? eventTimestamp.toISOString() : null,
        JSON.stringify(metadata),
      ],
    );

    const errorType = (payload.type || "").toLowerCase();
    if (["error", "fatal", "unhandledrejection"].includes(errorType)) {
      await sendAlertWebhook({
        title: "Client error threshold event",
        severity: "high",
        source: "client-error-monitor",
        details: {
          message: payload.message,
          type: payload.type,
          url: payload.url,
          ipAddress,
        },
      });
    }

    console.error("[client-error-monitor]", {
      message: payload?.message,
      type: payload?.type,
      url: payload?.url,
      timestamp: payload?.timestamp,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
