import { canCreateOrderFromAcceptance, canCustomerAcceptQuote, expiredQuoteCanBeAccepted, quoteIsExpired } from "@stax/quote-documents";

const shareLink = { id: "l", quoteDocumentId: "q", token: "t", expiresAt: "2099-01-01T00:00:00.000Z", documentApproved: true };

test("customer acceptance requires terms, valid link, and non-expired quote", () => {
  expect(canCustomerAcceptQuote({ shareLink, termsAccepted: true, quoteExpired: false })).toBe(true);
  expect(canCustomerAcceptQuote({ shareLink, termsAccepted: true, quoteExpired: true })).toBe(false);
});

test("expired quote cannot be accepted", () => {
  expect(expiredQuoteCanBeAccepted()).toBe(false);
  expect(quoteIsExpired({ validFrom: "2020-01-01T00:00:00.000Z", validUntil: "2020-01-02T00:00:00.000Z" })).toBe(true);
});

test("order requires customer acceptance", () => {
  expect(canCreateOrderFromAcceptance(true)).toBe(true);
  expect(canCreateOrderFromAcceptance(false)).toBe(false);
});
