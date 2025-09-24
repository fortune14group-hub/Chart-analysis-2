import { NextResponse } from "next/server";
import { togglePro } from "@/lib/auth";
import { addStatus } from "@/lib/utils/status";
import { uuid } from "@/lib/utils/uuid";

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || token !== process.env.DEV_ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { email, enabled } = body;
  if (typeof email !== "string") {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }
  await togglePro(email, Boolean(enabled));
  addStatus({
    id: uuid(),
    event: `PRO ${enabled ? "aktiverad" : "avaktiverad"}`,
    createdAt: new Date().toISOString(),
    payload: { email, enabled: Boolean(enabled) },
  });
  return NextResponse.json({ ok: true });
}
