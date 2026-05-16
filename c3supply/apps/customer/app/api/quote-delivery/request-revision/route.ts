import { NextResponse } from "next/server";
import { RecordCustomerQuoteRevisionRequestCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteDeliveryId":"delivery-placeholder","requestedBy":"customer-placeholder","reason":"Customer requested revision."}; const result = await new RecordCustomerQuoteRevisionRequestCommand().run(input, { actor: { id: "customer-placeholder", role: "CUSTOMER" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
