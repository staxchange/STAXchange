import type { PricingReviewDTO, QuotePricingSnapshotDTO } from "./types";

export function pricingApprovalRequiredBeforeQuoteDocumentApproval(): true {
  return true;
}

export function quoteDocumentCanBeApprovedWithPricing(snapshot: QuotePricingSnapshotDTO): boolean {
  return snapshot.pricingApproved && snapshot.pricingLocked;
}

export function noAutonomousPricing(): true {
  return true;
}

export function createPricingReview(input: {
  id: string;
  quoteId: string;
  reason: string;
  reviewRequired: boolean;
}): PricingReviewDTO {
  return {
    id: input.id,
    quoteId: input.quoteId,
    status: input.reviewRequired ? "PRICING_REVIEW_REQUIRED" : "COST_VALIDATED",
    reviewRequired: input.reviewRequired,
    reason: input.reason,
    createdAt: new Date().toISOString()
  };
}

export function lockQuotePricing(snapshot: QuotePricingSnapshotDTO): QuotePricingSnapshotDTO {
  if (!snapshot.pricingApproved) throw new Error("Pricing approval is required before locking quote pricing.");
  return { ...snapshot, pricingLocked: true };
}
