import { NextResponse } from "next/server";
import { RejectSupplierPurchaseOrderCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"supplierPoId":"po-placeholder","rejectedBy":"ops-placeholder","reason":"Needs revision."}; const result = await new RejectSupplierPurchaseOrderCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
