import { NextResponse } from "next/server";
import { CreatePaymentRequestCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteId":"quote-placeholder","currency":"CAD","amountCents":10000,"depositRequired":true,"depositAmountCents":2500,"quoteAccepted":true,"pricingApproved":true,"pricingLocked":true,"quoteDocumentApproved":true};
  const result = await new CreatePaymentRequestCommand().run(input, { actor: { id: "admin-payment-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
