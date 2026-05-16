import { NextResponse } from "next/server";
import { DraftSupplierPurchaseOrderCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"fulfillmentPlanId":"plan-placeholder","supplierName":"Goodwater","draftedBy":"ops-placeholder"}; const result = await new DraftSupplierPurchaseOrderCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
