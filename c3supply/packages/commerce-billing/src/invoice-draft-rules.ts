import type { CommerceInvoiceDraftDTO } from "./types";

export function validateInvoiceDraftReferences(input: Pick<CommerceInvoiceDraftDTO, "quoteId" | "orderId" | "paymentId" | "fulfillmentId">): string[] {
  const errors: string[] = [];
  if (!input.quoteId) errors.push("quoteId is required.");
  if (!input.orderId) errors.push("orderId is required.");
  if (!input.paymentId) errors.push("paymentId is required.");
  if (!input.fulfillmentId) errors.push("fulfillmentId is required.");
  return errors;
}
export function financeReviewRequiredBeforeInvoiceApproval(): true { return true; }
export function invoiceCanBeApproved(input: { financeReviewComplete: boolean; paymentReconciled: boolean; taxFreightReviewed: boolean }): boolean {
  return input.financeReviewComplete && input.paymentReconciled && input.taxFreightReviewed;
}
