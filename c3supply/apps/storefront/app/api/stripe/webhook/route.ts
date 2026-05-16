import { NextResponse } from "next/server";
import { mapStripeEventToSafeDTO, verifyStripeWebhookPlaceholder } from "@stax/stripe-payments";
import { RecordPaymentPendingCommand, RecordPaymentSucceededCommand, RecordPaymentFailedCommand, RecordPaymentCanceledCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") ?? undefined;
  const verification = verifyStripeWebhookPlaceholder({ signature, payload });
  const raw = payload ? JSON.parse(payload || "{}") : {};
  const event = mapStripeEventToSafeDTO(raw);

  const actor = { id: "stripe-webhook", role: "FINANCE" as const };
  const context = { actor, requestId: crypto.randomUUID() };

  let result;
  if (!verification.verified) {
    result = await new RecordPaymentPendingCommand().run({ paymentRequestId: "payment-placeholder", stripeEventId: event.id }, context);
  } else if (event.type.includes("succeeded")) {
    result = await new RecordPaymentSucceededCommand().run({ paymentRequestId: "payment-placeholder", stripeEventId: event.id }, context);
  } else if (event.type.includes("failed")) {
    result = await new RecordPaymentFailedCommand().run({ paymentRequestId: "payment-placeholder", stripeEventId: event.id, failureReason: "Stripe failure event" }, context);
  } else if (event.type.includes("canceled") || event.type.includes("expired")) {
    result = await new RecordPaymentCanceledCommand().run({ paymentRequestId: "payment-placeholder", stripeEventId: event.id }, context);
  } else {
    result = await new RecordPaymentPendingCommand().run({ paymentRequestId: "payment-placeholder", stripeEventId: event.id }, context);
  }

  return NextResponse.json({ verified: verification.verified, event, result });
}
