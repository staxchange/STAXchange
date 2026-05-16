import type { MarginResultDTO, MarginRuleDTO } from "./types";

export function calculateMarginPercent(sellPriceCents: number, costCents: number): number {
  if (sellPriceCents <= 0) return -100;
  return ((sellPriceCents - costCents) / sellPriceCents) * 100;
}

export function applyMarginRule(input: {
  sellPriceCents: number;
  costCents: number;
  rule: MarginRuleDTO;
}): MarginResultDTO {
  const marginPercent = calculateMarginPercent(input.sellPriceCents, input.costCents);
  const reviewRequired = marginPercent < input.rule.minimumMarginPercent;
  return {
    sellPriceCents: input.sellPriceCents,
    costCents: input.costCents,
    marginPercent,
    status: reviewRequired ? "REVIEW_REQUIRED" : "PASS",
    reviewRequired
  };
}

export function lowMarginTriggersReview(result: MarginResultDTO): boolean {
  return result.reviewRequired || result.status === "REVIEW_REQUIRED";
}
