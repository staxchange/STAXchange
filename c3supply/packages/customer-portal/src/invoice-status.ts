import type { CustomerInvoiceSummaryDTO } from "./types";

export function invoiceVisibleToCustomer(invoice: CustomerInvoiceSummaryDTO): boolean {
  return invoice.status === "APPROVED" || invoice.status === "BILLING_PACKET_CREATED" || invoice.status === "READY_FOR_SIMPLY_ACCOUNTING_EXPORT";
}
