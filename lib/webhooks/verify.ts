import { createHmac, timingSafeEqual } from "crypto";

export function verifySignature(payload: string, signature: string | null | undefined, secret: string | undefined) {
  if (!signature || !secret) return false;
  const digest = createHmac("sha256", secret).update(payload).digest("hex");
  const provided = Buffer.from(signature);
  const expected = Buffer.from(digest);
  if (provided.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(expected, provided);
}
