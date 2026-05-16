export type FulfillmentNotificationType = "FULFILLMENT_PLAN_CREATED" | "SHIPMENT_PENDING" | "SHIPMENT_CONFIRMED" | "CUSTOMER_NOTIFIED" | "FULFILLMENT_BLOCKED" | "DROPSHIP_REQUEST_PREPARED";
export interface FulfillmentNotificationResult { ok: boolean; skipped: boolean; type: FulfillmentNotificationType; reason?: string; }
export function createFulfillmentNotification(type: FulfillmentNotificationType): FulfillmentNotificationResult { return { ok: false, skipped: true, type, reason: "No notification provider configured in local/test mode." }; }
