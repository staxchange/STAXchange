import type { CommerceInvoiceDraftDTO, CustomerInvoiceViewDTO } from "./types";
export function createCustomerInvoiceView(invoice: CommerceInvoiceDraftDTO): CustomerInvoiceViewDTO {
  return { invoiceId: invoice.id, status: invoice.status, invoiceTotalCents: invoice.invoiceTotalCents, currency: invoice.currency, supplierCostVisible: false };
}
