export type PricingReviewStatus =
  | "COST_RECORD_CREATED"
  | "COST_VALIDATED"
  | "MARGIN_RULE_APPLIED"
  | "PRICING_REVIEW_REQUIRED"
  | "PRICING_APPROVED"
  | "PRICING_REJECTED"
  | "QUOTE_PRICING_LOCKED";

export interface QuotePricingSnapshotDTO {
  id: string;
  quoteId: string;
  currency: "CAD" | "USD";
  sellPriceCents: number;
  supplierCostCents?: number;
  supplierCostCurrency?: "CAD" | "USD";
  marginPercent?: number;
  pricingApproved: boolean;
  pricingLocked: boolean;
  createdAt: string;
}

export interface PricingReviewDTO {
  id: string;
  quoteId: string;
  status: PricingReviewStatus;
  reviewRequired: boolean;
  reason: string;
  createdAt: string;
}

export interface PricingApprovalEventDTO {
  id: string;
  quoteId: string;
  approvedBy: string;
  status: "APPROVED" | "REJECTED";
  reason?: string;
  createdAt: string;
}

export interface CurrencyConversionSnapshotDTO {
  id: string;
  fromCurrency: "USD" | "CAD";
  toCurrency: "USD" | "CAD";
  rate: number;
  source: string;
  createdAt: string;
}

export interface FreightEstimatePlaceholderDTO {
  id: string;
  quoteId: string;
  status: "PLACEHOLDER" | "CONFIRMED";
  note: string;
}
