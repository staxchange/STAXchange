import { NextResponse } from "next/server";
import { CreateFulfillmentRequestCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"fulfillmentPlanId":"plan-placeholder","requestedBy":"ops-placeholder"}; const result = await new CreateFulfillmentRequestCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
