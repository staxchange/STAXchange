import { NextResponse } from "next/server";
import { ApprovePaymentRequestCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"paymentRequestId":"payment-placeholder","approvedBy":"finance-placeholder"};
  const result = await new ApprovePaymentRequestCommand().run(input, { actor: { id: "admin-payment-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
