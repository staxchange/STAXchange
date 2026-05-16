import { canCreatePaymentRequest, paymentRequestRequiresAcceptedQuote, paymentRequestRequiresApprovedLockedPricing, paymentSuccessDoesNotAutoFulfill, paymentSuccessDoesNotPostAccounting } from "@stax/payments";

test("payment request requires accepted quote and approved locked pricing", () => {
  expect(paymentRequestRequiresAcceptedQuote()).toBe(true);
  expect(paymentRequestRequiresApprovedLockedPricing()).toBe(true);
  expect(canCreatePaymentRequest({ quoteAccepted: true, pricingApproved: true, pricingLocked: true, quoteDocumentApproved: true, amountCents: 1000 })).toBe(true);
  expect(canCreatePaymentRequest({ quoteAccepted: false, pricingApproved: true, pricingLocked: true, quoteDocumentApproved: true, amountCents: 1000 })).toBe(false);
});

test("payment success does not auto fulfill or post accounting", () => {
  expect(paymentSuccessDoesNotAutoFulfill()).toBe(true);
  expect(paymentSuccessDoesNotPostAccounting()).toBe(true);
});
