import { NextResponse } from "next/server";
import { UpdateSupplierCostRecordCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"costRecordId":"cost-placeholder","costCents":10000,"currency":"USD"};
  const result = await new UpdateSupplierCostRecordCommand().run(input, {
    actor: { id: "admin-pricing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
