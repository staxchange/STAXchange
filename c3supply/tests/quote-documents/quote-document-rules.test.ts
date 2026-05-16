import { canApproveQuoteDocument, canCreateQuoteDocumentFromCommerceQuote, containsAutonomousPricingLanguage, containsEngineeringConclusion } from "@stax/quote-documents";

test("approved commerce quote is required", () => {
  expect(canCreateQuoteDocumentFromCommerceQuote(true)).toBe(true);
  expect(canCreateQuoteDocumentFromCommerceQuote(false)).toBe(false);
});

test("document approval requires human reviewed lines", () => {
  expect(canApproveQuoteDocument({ approvedCommerceQuote: true, lines: [{ id: "l1", quoteDocumentId: "q1", description: "line", quantity: 1, humanReviewed: true }] })).toBe(true);
});

test("autonomous pricing and engineering conclusions are detected", () => {
  expect(containsAutonomousPricingLanguage("autonomous pricing")).toBe(true);
  expect(containsEngineeringConclusion("final sizing")).toBe(true);
});
