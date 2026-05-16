export interface StripeCheckoutSessionInput {
  paymentRequestId: string;
  amountCents: number;
  currency: "cad" | "usd";
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutSessionResult {
  ok: boolean;
  placeholder: boolean;
  paymentRequestId: string;
  checkoutSessionId?: string;
  url?: string;
  error?: string;
}

export interface StripeWebhookEventDTO {
  id: string;
  type: string;
  paymentIntentId?: string;
  checkoutSessionId?: string;
  safe: true;
}

export interface StripeWebhookVerificationResult {
  verified: boolean;
  reason?: string;
}
