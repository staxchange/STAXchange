import { NextResponse } from "next/server";
import { CloseQuoteDeliveryCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteDeliveryId":"delivery-placeholder","closedBy":"admin-placeholder"}; const result = await new CloseQuoteDeliveryCommand().run(input, { actor: { id: "admin-delivery-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
