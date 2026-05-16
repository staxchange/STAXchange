import { NextResponse } from "next/server";
import { RecordCustomerQuoteViewCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteDeliveryId":"delivery-placeholder","tokenHash":"opaque-token"}; const result = await new RecordCustomerQuoteViewCommand().run(input, { actor: { id: "public-quote-view", role: "PUBLIC" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
