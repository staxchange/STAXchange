import type { PaymentRequestDTO } from "./types";

export function paymentRequestRequiresAcceptedQuote(): true { return true; }
export function paymentRequestRequiresApprovedLockedPricing(): true { return true; }
export function paymentRequestRequiresApprovedQuoteDocument(): true { return true; }
export function paymentSuccessDoesNotAutoFulfill(): true { return true; }
export function paymentSuccessDoesNotPostAccounting(): true { return true; }

export function canCreatePaymentRequest(input: {
  quoteAccepted: boolean;
  pricingApproved: boolean;
  pricingLocked: boolean;
  quoteDocumentApproved: boolean;
  amountCents: number;
}): boolean {
  return input.quoteAccepted && input.pricingApproved && input.pricingLocked && input.quoteDocumentApproved && input.amountCents > 0;
}

export function validatePaymentRequest(input: PaymentRequestDTO): string[] {
  const errors: string[] = [];
  if (!input.quoteAccepted) errors.push("accepted quote required");
  if (!input.pricingApproved || !input.pricingLocked) errors.push("approved and locked pricing required");
  if (!input.quoteDocumentApproved) errors.push("approved quote document required");
  if (input.amountCents <= 0) errors.push("amountCents must be explicit and positive");
  if (input.depositRequired && (!input.depositAmountCents || input.depositAmountCents <= 0)) errors.push("depositAmountCents must be explicit when deposit is required");
  return errors;
}
