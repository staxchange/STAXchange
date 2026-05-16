import type { StripeCheckoutSessionInput, StripeCheckoutSessionResult } from "./types";
import { stripeSecretKeyConfigured } from "./stripe-env";

export function buildStripeCheckoutSession(input: StripeCheckoutSessionInput, env: Record<string, string | undefined> = process.env): StripeCheckoutSessionResult {
  if (!stripeSecretKeyConfigured(env)) {
    return {
      ok: false,
      placeholder: true,
      paymentRequestId: input.paymentRequestId,
      error: "STRIPE_SECRET_KEY is not configured. Placeholder checkout only."
    };
  }

  return {
    ok: true,
    placeholder: true,
    paymentRequestId: input.paymentRequestId,
    checkoutSessionId: `placeholder_${input.paymentRequestId}`,
    url: input.successUrl
  };
}
