import { NextResponse } from "next/server";
import { CreateFulfillmentPlanCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"orderId":"order-placeholder","quoteId":"quote-placeholder","paymentId":"payment-placeholder"}; const result = await new CreateFulfillmentPlanCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
