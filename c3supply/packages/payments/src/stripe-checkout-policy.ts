export function checkoutRequiresApprovedPaymentRequest(status: string): boolean {
  return status === "PAYMENT_REQUEST_APPROVED";
}

export function checkoutDoesNotExposeSupplierCost(): true { return true; }
export function checkoutDoesNotSyncAccounting(): true { return true; }
