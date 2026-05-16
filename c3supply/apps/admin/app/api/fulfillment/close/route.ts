import { NextResponse } from "next/server";
import { CloseFulfillmentCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"fulfillmentId":"fulfillment-placeholder","closedBy":"ops-placeholder","reason":"Fulfillment closed."}; const result = await new CloseFulfillmentCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
