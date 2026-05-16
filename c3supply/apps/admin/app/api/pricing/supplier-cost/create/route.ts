import { NextResponse } from "next/server";
import { CreateSupplierCostRecordCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"productId":"product-placeholder","supplierName":"Goodwater","costCents":10000,"currency":"USD","costLevel":"SINGLE_PURCHASE"};
  const result = await new CreateSupplierCostRecordCommand().run(input, {
    actor: { id: "admin-pricing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
