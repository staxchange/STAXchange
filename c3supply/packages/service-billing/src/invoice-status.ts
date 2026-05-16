import type { ServiceInvoiceStatus } from "./types";

export function canSubmitInvoiceForReview(status: ServiceInvoiceStatus): boolean {
  return status === "DRAFT" || status === "LINE_ITEMS_ADDED";
}

export function canApproveInvoice(status: ServiceInvoiceStatus): boolean {
  return status === "REVIEW_REQUIRED";
}

export function canCreateBillingPacket(status: ServiceInvoiceStatus): boolean {
  return status === "APPROVED";
}

export function canCreateSageExportBatch(status: ServiceInvoiceStatus): boolean {
  return status === "BILLING_PACKET_CREATED";
}
