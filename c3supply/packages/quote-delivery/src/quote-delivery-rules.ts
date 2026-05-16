import type { QuoteDeliveryDTO } from "./types";

export function quoteDeliveryRequiresApprovedLockedPricing(input: Pick<QuoteDeliveryDTO, "pricingApproved" | "pricingLocked">): boolean {
  return input.pricingApproved && input.pricingLocked;
}

export function quoteDeliveryRequiresApprovedDocument(input: Pick<QuoteDeliveryDTO, "documentApproved">): boolean {
  return input.documentApproved;
}

export function quoteDeliveryCanBeCreated(input: Pick<QuoteDeliveryDTO, "pricingApproved" | "pricingLocked" | "documentApproved">): boolean {
  return quoteDeliveryRequiresApprovedLockedPricing(input) && quoteDeliveryRequiresApprovedDocument(input);
}

export function quoteDeliveryExposesSupplierCost(): false { return false; }
export function quoteDeliveryUsesAutonomousPricing(): false { return false; }
export function quoteDeliveryUsesDirectAccountingSync(): false { return false; }
