import { NextResponse } from "next/server";
import { CreateStripeCheckoutSessionCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"paymentRequestId":"payment-placeholder","amountCents":10000,"currency":"CAD","paymentRequestApproved":true};
  const result = await new CreateStripeCheckoutSessionCommand().run(input, { actor: { id: "admin-payment-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
