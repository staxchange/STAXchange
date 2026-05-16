export type QuoteDeliveryNotificationKind =
  | "QUOTE_READY"
  | "QUOTE_VIEWED"
  | "QUOTE_ACCEPTED"
  | "REVISION_REQUESTED"
  | "DELIVERY_FAILED";

export interface QuoteDeliveryNotificationInput {
  kind: QuoteDeliveryNotificationKind;
  recipient?: string;
  quoteDeliveryId: string;
}

export interface QuoteDeliveryNotificationResult {
  ok: boolean;
  status: "SKIPPED" | "QUEUED" | "SENT" | "FAILED";
  reason?: string;
}

export function buildQuoteDeliveryNotification(input: QuoteDeliveryNotificationInput): QuoteDeliveryNotificationResult {
  if (!input.recipient) {
    return { ok: false, status: "SKIPPED", reason: "No recipient configured." };
  }
  return { ok: true, status: "QUEUED" };
}
