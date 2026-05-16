import { lockQuotePricing, pricingApprovalRequiredBeforeQuoteDocumentApproval, quoteDocumentCanBeApprovedWithPricing } from "@stax/pricing-governance";

test("quote document approval requires pricing approval", () => {
  expect(pricingApprovalRequiredBeforeQuoteDocumentApproval()).toBe(true);
  expect(quoteDocumentCanBeApprovedWithPricing({
    id: "snapshot-1",
    quoteId: "quote-1",
    currency: "CAD",
    sellPriceCents: 10000,
    pricingApproved: false,
    pricingLocked: false,
    createdAt: new Date().toISOString()
  })).toBe(false);
});

test("pricing lock requires approval", () => {
  expect(() => lockQuotePricing({
    id: "snapshot-1",
    quoteId: "quote-1",
    currency: "CAD",
    sellPriceCents: 10000,
    pricingApproved: false,
    pricingLocked: false,
    createdAt: new Date().toISOString()
  })).toThrow();
});
