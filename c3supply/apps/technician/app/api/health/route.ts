import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "dwg-technician",
    timestamp: new Date().toISOString()
  });
}
