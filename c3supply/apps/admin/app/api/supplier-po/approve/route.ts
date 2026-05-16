import { NextResponse } from "next/server";
import { ApproveSupplierPurchaseOrderCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"supplierPoId":"po-placeholder","approvedBy":"ops-placeholder"}; const result = await new ApproveSupplierPurchaseOrderCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
