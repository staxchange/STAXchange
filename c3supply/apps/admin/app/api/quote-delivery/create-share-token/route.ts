import { NextResponse } from "next/server";
import { CreateQuoteDeliveryShareTokenCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteDeliveryId":"delivery-placeholder","tokenHash":"opaque-token-hash","expiresAt":"2099-01-01T00:00:00.000Z"}; const result = await new CreateQuoteDeliveryShareTokenCommand().run(input, { actor: { id: "admin-delivery-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
