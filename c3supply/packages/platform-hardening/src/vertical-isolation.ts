import type { PlatformVertical, VerticalIsolationResult } from "./types";

export const activeVertical: PlatformVertical = "dwg-commerce-service";

export const blockedCollectiblesTerms = [
  "cards_master",
  "vault_items",
  "sports-card marketplace",
  "sports card marketplace",
  "break room",
  "collectibles trust score",
  "card data seeding"
];

export function evaluateVerticalIsolation(text: string): VerticalIsolationResult {
  const normalized = text.toLowerCase();
  const blockedTerms = blockedCollectiblesTerms.filter((term) =>
    normalized.includes(term.toLowerCase())
  );

  return {
    allowed: blockedTerms.length === 0,
    activeVertical,
    blockedTerms,
    reason:
      blockedTerms.length === 0
        ? "No Collectibles vertical terms detected in active implementation text."
        : "Collectibles vertical terms detected in DWG ecommerce/service context."
  };
}

export function assertDwgVerticalOnly(text: string): void {
  const result = evaluateVerticalIsolation(text);

  if (!result.allowed) {
    throw new Error(`DWG vertical isolation failed: ${result.blockedTerms.join(", ")}`);
  }
}
