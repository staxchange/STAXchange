export function shipmentConfirmationRequiresHumanRecord(): true { return true; }
export function shipmentStatusIsCustomerSafe(status: string): boolean {
  return ["SHIPMENT_PENDING", "SHIPMENT_CONFIRMED"].includes(status);
}
