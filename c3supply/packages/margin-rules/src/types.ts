export type MarginApprovalStatus = "PASS" | "REVIEW_REQUIRED" | "REJECTED";

export interface MarginRuleDTO {
  id: string;
  categorySlug: string;
  targetMarginPercent: number;
  minimumMarginPercent: number;
  createdAt: string;
}

export interface MarginReviewThresholdDTO {
  id: string;
  marginFloorPercent: number;
  reviewBelowPercent: number;
}

export interface MarginResultDTO {
  sellPriceCents: number;
  costCents: number;
  marginPercent: number;
  status: MarginApprovalStatus;
  reviewRequired: boolean;
}
