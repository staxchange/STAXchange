import {
  canApproveInvoice,
  canCreateBillingPacket,
  canCreateSageExportBatch,
  canSubmitInvoiceForReview
} from "@stax/service-billing";

test("invoice can be submitted for review from draft", () => {
  expect(canSubmitInvoiceForReview("DRAFT")).toBe(true);
});

test("invoice approval requires review state", () => {
  expect(canApproveInvoice("REVIEW_REQUIRED")).toBe(true);
  expect(canApproveInvoice("DRAFT")).toBe(false);
});

test("billing packet requires approved invoice", () => {
  expect(canCreateBillingPacket("APPROVED")).toBe(true);
  expect(canCreateBillingPacket("REVIEW_REQUIRED")).toBe(false);
});

test("Simply Accounting export batch requires billing packet state", () => {
  expect(canCreateSageExportBatch("BILLING_PACKET_CREATED")).toBe(true);
  expect(canCreateSageExportBatch("APPROVED")).toBe(false);
});
