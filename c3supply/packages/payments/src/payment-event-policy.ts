export function mapPaymentEventStatus(eventType: string): "PAYMENT_PENDING" | "PAYMENT_SUCCEEDED" | "PAYMENT_FAILED" | "PAYMENT_CANCELED" {
  if (eventType.includes("succeeded")) return "PAYMENT_SUCCEEDED";
  if (eventType.includes("failed")) return "PAYMENT_FAILED";
  if (eventType.includes("canceled") || eventType.includes("expired")) return "PAYMENT_CANCELED";
  return "PAYMENT_PENDING";
}

export function paymentEventIsAccountingSync(): false { return false; }
