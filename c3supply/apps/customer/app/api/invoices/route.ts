import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: true, data: [{ "id": "invoice-placeholder", "status": "APPROVED", "subtotalCents": 0, "currency": "CAD" }] });
}
