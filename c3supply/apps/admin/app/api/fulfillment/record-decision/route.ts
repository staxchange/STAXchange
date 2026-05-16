import { NextResponse } from "next/server";
import { RecordInventoryOrDropshipDecisionCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"fulfillmentPlanId":"plan-placeholder","route":"MANUAL_REVIEW","decidedBy":"ops-placeholder","note":"Decision recorded for review."}; const result = await new RecordInventoryOrDropshipDecisionCommand().run(input, { actor: { id: "ops-placeholder", role: "OPS" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
