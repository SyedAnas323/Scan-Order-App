import crypto from "crypto";
import { NextResponse } from "next/server";
import { activateSubscription } from "@/lib/data-store";

function verifyPaddleSignature(signatureHeader: string, body: string, secret: string) {
  const segments = signatureHeader.split(";").map((segment) => segment.trim());
  const timestamp = segments.find((segment) => segment.startsWith("ts="))?.slice(3);
  const signatures = segments.filter((segment) => segment.startsWith("h1=")).map((segment) => segment.slice(3));

  if (!timestamp || !signatures.length) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}:${body}`).digest("hex");
  return signatures.some((signature) => signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)));
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("paddle-signature");
  const secret = process.env.PADDLE_WEBHOOK_SECRET;

  if (secret && signature) {
    if (!verifyPaddleSignature(signature, body, secret)) {
      return NextResponse.json({ ok: false, error: "Invalid Paddle signature." }, { status: 401 });
    }
  }

  try {
    const payload = JSON.parse(body) as {
      event_type?: string;
      data?: {
        status?: string;
        custom_data?: { userId?: string };
      };
    };

    const userId = payload.data?.custom_data?.userId;
    const shouldActivate =
      payload.event_type === "transaction.completed" ||
      payload.event_type === "subscription.created" ||
      payload.event_type === "subscription.activated" ||
      payload.data?.status === "active" ||
      payload.data?.status === "completed";

    if (userId && shouldActivate) {
      await activateSubscription(userId);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid webhook payload." }, { status: 400 });
  }
}
