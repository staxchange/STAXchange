import { mapStripeEventToSafeDTO, stripeWebhookVerificationIsServerOnly, verifyStripeWebhookPlaceholder } from "@stax/stripe-payments";
test("webhook verification is server only and safe", () => {
  expect(stripeWebhookVerificationIsServerOnly()).toBe(true);
  expect(verifyStripeWebhookPlaceholder({ payload: "{}" }, {}).verified).toBe(false);
  expect(mapStripeEventToSafeDTO({ id: "evt_1", type: "checkout.session.completed" }).safe).toBe(true);
});
