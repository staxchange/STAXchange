import { NextResponse } from "next/server";
import { RecordInventoryAdjustmentCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"workOrderId":"placeholder-work-order","reason":"SERVICE_PART_USED","quantityDelta":-1};

  const result = await new RecordInventoryAdjustmentCommand().run(input, {
    actor: { id: "admin-billing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
