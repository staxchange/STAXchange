export type PaymentNotificationType = "PAYMENT_REQUEST_APPROVED" | "CHECKOUT_SESSION_CREATED" | "PAYMENT_SUCCEEDED" | "PAYMENT_FAILED" | "REFUND_REVIEW_REQUESTED";

export interface PaymentNotificationInput { type: PaymentNotificationType; recipient?: string; paymentRequestId: string; }
export interface PaymentNotificationResult { ok: boolean; skipped: boolean; reason?: string; }

export async function sendPaymentNotification(input: PaymentNotificationInput, env: Record<string, string | undefined> = process.env): Promise<PaymentNotificationResult> {
  void input;
  if (!env.PAYMENT_NOTIFICATION_WEBHOOK_URL) return { ok: false, skipped: true, reason: "Payment notification provider not configured." };
  return { ok: true, skipped: false };
}
