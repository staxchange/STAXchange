import { NextResponse } from "next/server";
import { RecordCustomerQuoteAcceptanceCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteDeliveryId":"delivery-placeholder","actorId":"customer-placeholder","acceptedTerms":true}; const result = await new RecordCustomerQuoteAcceptanceCommand().run(input, { actor: { id: "customer-placeholder", role: "CUSTOMER" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
