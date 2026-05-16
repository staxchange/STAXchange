export type OrderStatus = "DRAFT" | "CREATED" | "READY_FOR_BILLING" | "CANCELLED";
export type FulfillmentStatus = "NOT_READY" | "PENDING" | "FULFILLMENT_REQUESTED" | "FULFILLED";
export type BillingReadinessStatus = "NOT_READY" | "READY_FOR_BILLING" | "BILLING_PACKET_CREATED";
export interface OrderLineDTO { id: string; orderId: string; productId: string; description: string; quantity: number; unitPriceCents?: number; }
export interface OrderDTO { id: string; quoteId: string; status: OrderStatus; fulfillmentStatus: FulfillmentStatus; billingReadiness: BillingReadinessStatus; lines: OrderLineDTO[]; createdAt: string; }
