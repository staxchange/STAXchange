import type { QuoteDocumentDTO } from "./types";

export function canCreateQuoteDocumentFromCommerceQuote(approvedCommerceQuote: boolean): boolean {
  return approvedCommerceQuote === true;
}

export function canApproveQuoteDocument(document: Pick<QuoteDocumentDTO, "approvedCommerceQuote" | "lines">): boolean {
  return document.approvedCommerceQuote && document.lines.every((line) => line.humanReviewed);
}

export function containsAutonomousPricingLanguage(text: string): boolean {
  const normalized = text.toLowerCase();
  return ["autonomous pricing", "ai price", "automatic price", "system recommends", "recommended price"].some((token) => normalized.includes(token));
}

export function containsEngineeringConclusion(text: string): boolean {
  const normalized = text.toLowerCase();
  return ["engineering conclusion", "final sizing", "compatibility confirmed", "warranty approved"].some((token) => normalized.includes(token));
}

export function canGeneratePdfOrShareLink(documentApproved: boolean): boolean {
  return documentApproved === true;
}


export function quoteDocumentApprovalRequiresPricingApproval(): true {
  return true;
}

export function quoteDocumentCanBeCustomerFacing(input: { pricingApproved: boolean; pricingLocked: boolean; documentApproved: boolean }): boolean {
  return input.documentApproved && input.pricingApproved && input.pricingLocked;
}
