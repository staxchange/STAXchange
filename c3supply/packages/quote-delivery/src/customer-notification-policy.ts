import type { QuoteDeliveryStatus, QuoteNotificationDTO } from "./types";

export function customerNotificationRequiresShareLinkReady(status: QuoteDeliveryStatus): boolean {
  return status === "SHARE_LINK_READY";
}

export function createSkippedQuoteNotification(input: { id: string; quoteDeliveryId: string; recipient: string; reason: string }): QuoteNotificationDTO {
  return {
    id: input.id,
    quoteDeliveryId: input.quoteDeliveryId,
    channel: "EMAIL",
    recipient: input.recipient,
    status: "SKIPPED",
    reason: input.reason,
    createdAt: new Date().toISOString()
  };
}
