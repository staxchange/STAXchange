export const simplyAccountingCustomerColumns = [
  "customerId",
  "customerName",
  "customerEmail",
  "billingAddress"
] as const;

export const simplyAccountingInvoiceColumns = [
  "invoiceId",
  "customerId",
  "invoiceDate",
  "currency",
  "description",
  "subtotalCents",
  "taxCents",
  "totalCents"
] as const;

export const simplyAccountingInvoiceLineColumns = [
  "invoiceId",
  "lineId",
  "itemCode",
  "description",
  "quantity",
  "unitPriceCents",
  "totalCents",
  "revenueAccount"
] as const;
