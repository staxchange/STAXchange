import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "dwg-storefront",
    timestamp: new Date().toISOString()
  });
}
