export function financeReviewRequired(): true {
  return true;
}

export function sage50ExportDirectSyncAllowed(): false {
  return false;
}

export function invoiceApprovalRequiredBeforeExport(invoiceStatus: string): boolean {
  return invoiceStatus !== "APPROVED" && invoiceStatus !== "BILLING_PACKET_CREATED";
}
