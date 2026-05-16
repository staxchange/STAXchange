export function fulfillmentRequiresAcceptedOrder(): true { return true; }
export function fulfillmentRequiresPaymentOrOverride(input: { paymentSucceeded: boolean; paymentOverrideApproved?: boolean }): boolean {
  return input.paymentSucceeded || input.paymentOverrideApproved === true;
}
export function fulfillmentRequiresHumanReview(): true { return true; }
export function autoFulfillmentAllowed(): false { return false; }
export function supplierCostVisibleToCustomer(): false { return false; }
