import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, data: [{ "id": "system-placeholder", "systemType": "UNKNOWN", "verified": true }] });
}
