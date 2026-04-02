import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { enforceDbRateLimit } from "@/lib/rate-limit";
import { contactSchema, parseBody } from "@/lib/validation";

function getClientId(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const clientId = getClientId(request);
  const limiter = await enforceDbRateLimit({
    routeKey: "contact",
    subjectKey: clientId,
    windowSeconds: 10,
    maxHits: 1,
  });

  if (limiter.limited) {
    return NextResponse.json(
      { success: false, message: "Please wait a few seconds before sending another message." },
      { status: 429 },
    );
  }

  try {
    const parsed = await parseBody(request, contactSchema);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const body = parsed.data;
    const now = Date.now();

    if (body?.website) {
      return NextResponse.json({ success: true, message: "Message received." });
    }

    const formStartedAt = Number(body?.formStartedAt || 0);
    if (!formStartedAt || now - formStartedAt < 3_000) {
      return NextResponse.json(
        { success: false, message: "Submission rejected. Please try again." },
        { status: 400 },
      );
    }

    const name = body.name.trim();
    const email = body.email.trim();
    const subject = String(body.subject || "").trim();
    const message = body.message.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const db = getDb();
    const userAgent = request.headers.get("user-agent");
    const ipAddress = clientId === "unknown" ? null : clientId;

    await db.query(
      `
        insert into contact_submissions (
          full_name,
          email,
          subject,
          message,
          source,
          user_agent,
          ip_address,
          submitted_at
        )
        values ($1, $2, $3, $4, 'website-contact-form', $5, $6, now());
      `,
      [name, email, subject || null, message, userAgent, ipAddress],
    );

    console.info("[contact-lead]", {
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString(),
      source: "website-contact-form",
    });

    return NextResponse.json({
      success: true,
      message: "Thanks! Your message has been received. I'll respond soon.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to submit your message right now." },
      { status: 500 },
    );
  }
}
