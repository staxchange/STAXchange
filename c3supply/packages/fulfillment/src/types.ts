export type FulfillmentStatus =
  | "FULFILLMENT_REVIEW_REQUIRED"
  | "FULFILLMENT_PLAN_CREATED"
  | "INVENTORY_OR_DROPSHIP_DECISION_REQUIRED"
  | "FULFILLMENT_REQUEST_CREATED"
  | "SHIPMENT_PENDING"
  | "SHIPMENT_CONFIRMED"
  | "CUSTOMER_NOTIFIED"
  | "FULFILLMENT_CLOSED"
  | "FULFILLMENT_BLOCKED";

export type FulfillmentRoute = "INVENTORY" | "DROPSHIP" | "SERVICE_WORK_ORDER" | "MANUAL_REVIEW";

export interface FulfillmentPlanLineDTO {
  id: string;
  productId: string;
  quantity: number;
  route: FulfillmentRoute;
}

export interface FulfillmentPlanDTO {
  id: string;
  orderId: string;
  quoteId: string;
  paymentId?: string;
  customerId?: string;
  status: FulfillmentStatus;
  lines: FulfillmentPlanLineDTO[];
  reviewRequired: true;
  createdAt: string;
}

export interface InventoryDecisionDTO {
  id: string;
  fulfillmentPlanId: string;
  route: FulfillmentRoute;
  decidedBy: string;
  note: string;
}

export interface DropshipDecisionDTO {
  id: string;
  fulfillmentPlanId: string;
  supplierName: string;
  route: "DROPSHIP";
  preparedOnly: true;
}

export interface ShipmentPlaceholderDTO {
  id: string;
  fulfillmentRequestId: string;
  shipmentCarrier?: string;
  trackingReference?: string;
  status: "SHIPMENT_PENDING" | "SHIPMENT_CONFIRMED";
}

export interface CustomerFulfillmentViewDTO {
  orderId: string;
  status: FulfillmentStatus;
  shipmentCarrier?: string;
  trackingReference?: string;
  customerMessage: string;
}
