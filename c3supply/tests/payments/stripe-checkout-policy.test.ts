import { checkoutRequiresApprovedPaymentRequest } from "@stax/payments";
import { buildStripeCheckoutSession, forbiddenPublicStripeSecrets } from "@stax/stripe-payments";
test("checkout requires approved payment request", () => {
  expect(checkoutRequiresApprovedPaymentRequest("PAYMENT_REQUEST_APPROVED")).toBe(true);
  expect(checkoutRequiresApprovedPaymentRequest("PAYMENT_REVIEW_REQUIRED")).toBe(false);
});
test("checkout builder returns placeholder without Stripe key", () => {
  const result = buildStripeCheckoutSession({ paymentRequestId: "p1", amountCents: 1000, currency: "cad", successUrl: "https://example.com/s", cancelUrl: "https://example.com/c" }, {});
  expect(result.placeholder).toBe(true);
});
test("public Stripe secrets are forbidden", () => {
  expect(forbiddenPublicStripeSecrets({ NEXT_PUBLIC_STRIPE_SECRET_KEY: "bad" })).toContain("NEXT_PUBLIC_STRIPE_SECRET_KEY");
});
