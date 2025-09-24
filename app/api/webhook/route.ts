import { NextResponse } from "next/server";
import { handleWebhook } from "@/lib/webhooks/handle";
import { verifySignature } from "@/lib/webhooks/verify";
import { assertIdempotency } from "@/lib/utils/idempotency";
import { addStatus } from "@/lib/utils/status";
import { uuid } from "@/lib/utils/uuid";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("x-webhook-signature");
  const secret = process.env.WEBHOOK_SECRET;
  if (!verifySignature(payload, signature, secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }
  const event = JSON.parse(payload);
  const idempotencyKey = request.headers.get("x-idempotency-key") || event.id;
  const ttl = Number(process.env.WEBHOOK_IDEMP_TTL_MS ?? 7_200_000);
  if (!assertIdempotency(idempotencyKey, ttl)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }
  const result = handleWebhook(event);
  addStatus({ id: uuid(), event: `Webhook mottagen: ${event.type}`, createdAt: new Date().toISOString(), payload: event });
  return NextResponse.json(result);
}
