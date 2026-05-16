import { NextResponse } from "next/server";
import { MarkSupplierCostStaleCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"costRecordId":"cost-placeholder","reason":"Cost expired or source changed."};
  const result = await new MarkSupplierCostStaleCommand().run(input, {
    actor: { id: "admin-pricing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
