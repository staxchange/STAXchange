import { NextResponse } from "next/server";
import { RequestRefundReviewCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"paymentRequestId":"payment-placeholder","requestedBy":"finance-placeholder","reason":"Refund review requested."};
  const result = await new RequestRefundReviewCommand().run(input, { actor: { id: "admin-payment-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
