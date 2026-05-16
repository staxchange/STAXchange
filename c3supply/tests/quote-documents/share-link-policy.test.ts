import { canCreateShareLink, createOpaqueQuoteToken, shareLinkIsValid } from "@stax/quote-documents";

test("document approval required before share link", () => {
  expect(canCreateShareLink(true)).toBe(true);
  expect(canCreateShareLink(false)).toBe(false);
});

test("share link validity requires approval and future expiry", () => {
  expect(createOpaqueQuoteToken()).toBeTruthy();
  expect(shareLinkIsValid({ id: "l", quoteDocumentId: "q", token: "t", expiresAt: "2099-01-01T00:00:00.000Z", documentApproved: true })).toBe(true);
});
