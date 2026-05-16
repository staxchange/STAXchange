import { NextResponse } from "next/server";
import { SubmitSupplierPurchaseOrderForReviewCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"supplierPoId":"po-placeholder","submittedBy":"ops-placeholder"}; const result = await new SubmitSupplierPurchaseOrderForReviewCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
