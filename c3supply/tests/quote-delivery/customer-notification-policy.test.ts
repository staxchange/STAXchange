import { createSkippedQuoteNotification, customerNotificationRequiresShareLinkReady } from "@stax/quote-delivery";
test("customer notification requires share link ready", () => { expect(customerNotificationRequiresShareLinkReady("SHARE_LINK_READY")).toBe(true); expect(customerNotificationRequiresShareLinkReady("DELIVERY_DRAFTED")).toBe(false); });
test("missing provider can skip safely", () => { const result = createSkippedQuoteNotification({ id: "n", quoteDeliveryId: "d", recipient: "customer@example.com", reason: "No provider" }); expect(result.status).toBe("SKIPPED"); });
