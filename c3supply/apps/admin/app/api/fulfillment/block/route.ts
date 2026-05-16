import { NextResponse } from "next/server";
import { BlockFulfillmentCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"fulfillmentId":"fulfillment-placeholder","blockedBy":"ops-placeholder","reason":"Blocked pending review."}; const result = await new BlockFulfillmentCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
