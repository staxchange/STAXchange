import { NextResponse } from "next/server";
import { SubmitPaymentRequestForReviewCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"paymentRequestId":"payment-placeholder","submittedBy":"sales-placeholder"};
  const result = await new SubmitPaymentRequestForReviewCommand().run(input, { actor: { id: "admin-payment-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
