import { NextResponse } from "next/server";
import { getStatus } from "@/lib/utils/status";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");
  if (!token || token !== process.env.STATUS_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ data: getStatus() });
}
