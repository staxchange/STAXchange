import { NextResponse } from "next/server";
import { CreateQuoteDeliveryCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteId":"quote-placeholder","quoteDocumentId":"doc-placeholder","quotePricingSnapshotId":"pricing-placeholder","channel":"EMAIL","pricingApproved":true,"pricingLocked":true,"documentApproved":true}; const result = await new CreateQuoteDeliveryCommand().run(input, { actor: { id: "admin-delivery-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
