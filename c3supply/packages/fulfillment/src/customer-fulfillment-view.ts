import type { CustomerFulfillmentViewDTO, FulfillmentStatus } from "./types";
import { customerStatusLabel } from "./order-status-policy";
export function createCustomerFulfillmentView(input: { orderId: string; status: FulfillmentStatus; shipmentCarrier?: string; trackingReference?: string }): CustomerFulfillmentViewDTO {
  return { orderId: input.orderId, status: input.status, shipmentCarrier: input.shipmentCarrier, trackingReference: input.trackingReference, customerMessage: customerStatusLabel(input.status) };
}
export function customerViewContainsSupplierPO(): false { return false; }
