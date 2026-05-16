import { NextResponse } from "next/server";
import { RequestSupplierPORevisionCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"supplierPoId":"po-placeholder","requestedBy":"ops-placeholder","reason":"Revise supplier PO."}; const result = await new RequestSupplierPORevisionCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
