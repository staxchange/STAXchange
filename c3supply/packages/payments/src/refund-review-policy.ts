export function refundRequiresHumanReview(): true { return true; }
export function canRequestRefundReview(status: string): boolean { return status === "PAYMENT_SUCCEEDED"; }
