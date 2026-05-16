import type { StripeWebhookEventDTO } from "./types";

export function mapStripeEventToSafeDTO(event: { id?: string; type?: string; data?: unknown }): StripeWebhookEventDTO {
  return {
    id: event.id ?? "unknown_stripe_event",
    type: event.type ?? "unknown",
    safe: true
  };
}
