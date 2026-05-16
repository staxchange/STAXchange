import type { FulfillmentStatus } from "./types";
export function customerStatusLabel(status: FulfillmentStatus): string {
  const labels: Record<FulfillmentStatus,string> = {
    FULFILLMENT_REVIEW_REQUIRED: "Order received for fulfillment review",
    FULFILLMENT_PLAN_CREATED: "Fulfillment plan created",
    INVENTORY_OR_DROPSHIP_DECISION_REQUIRED: "Fulfillment route under review",
    FULFILLMENT_REQUEST_CREATED: "Fulfillment request created",
    SHIPMENT_PENDING: "Shipment pending",
    SHIPMENT_CONFIRMED: "Shipment confirmed",
    CUSTOMER_NOTIFIED: "Customer notified",
    FULFILLMENT_CLOSED: "Fulfillment closed",
    FULFILLMENT_BLOCKED: "Fulfillment blocked pending review"
  };
  return labels[status];
}
