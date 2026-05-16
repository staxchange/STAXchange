import type { StripeWebhookVerificationResult } from "./types";
import { stripeWebhookSecretConfigured } from "./stripe-env";

export function verifyStripeWebhookPlaceholder(input: { signature?: string; payload: string }, env: Record<string, string | undefined> = process.env): StripeWebhookVerificationResult {
  if (!stripeWebhookSecretConfigured(env)) return { verified: false, reason: "STRIPE_WEBHOOK_SECRET is not configured." };
  if (!input.signature) return { verified: false, reason: "Missing Stripe signature." };
  return { verified: true };
}

export function stripeWebhookVerificationIsServerOnly(): true { return true; }
