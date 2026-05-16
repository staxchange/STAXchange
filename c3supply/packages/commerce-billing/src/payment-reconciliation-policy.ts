export function paymentReconciliationRequired(): true { return true; }
export function canSubmitFinanceReview(input: { paymentReconciled: boolean; taxFreightReviewed: boolean }): boolean { return input.paymentReconciled && input.taxFreightReviewed; }
