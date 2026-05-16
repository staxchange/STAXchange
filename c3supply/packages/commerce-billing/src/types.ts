export type CommerceInvoiceStatus =
  | "INVOICE_DRAFT_CREATED"
  | "PAYMENT_RECONCILIATION_REQUIRED"
  | "TAX_FREIGHT_REVIEW_REQUIRED"
  | "FINANCE_REVIEW_REQUIRED"
  | "INVOICE_APPROVED"
  | "INVOICE_REJECTED"
  | "BILLING_PACKET_CREATED"
  | "READY_FOR_SIMPLY_ACCOUNTING_EXPORT"
  | "INVOICE_CLOSED";

export type BillingPacketStatus = "DRAFT" | "CREATED" | "READY_FOR_EXPORT" | "CLOSED";

export interface CommerceInvoiceLineDTO {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface CommerceInvoiceDraftDTO {
  id: string;
  quoteId: string;
  orderId: string;
  paymentId: string;
  fulfillmentId: string;
  customerId: string;
  customerEmail?: string;
  currency: "CAD" | "USD";
  invoiceSubtotalCents: number;
  taxPlaceholderCents: number;
  freightPlaceholderCents: number;
  invoiceTotalCents: number;
  status: CommerceInvoiceStatus;
  financeReviewRequired: true;
  paymentReconciled: boolean;
  lines: CommerceInvoiceLineDTO[];
  createdAt: string;
}

export interface BillingPacketDTO {
  id: string;
  invoiceId: string;
  status: BillingPacketStatus;
  readyForSimplyAccountingExport: boolean;
  createdAt: string;
}

export interface PaymentReconciliationDTO {
  id: string;
  invoiceId: string;
  paymentId: string;
  reconciled: boolean;
  note?: string;
  createdAt: string;
}

export interface TaxPlaceholderDTO { id: string; invoiceId: string; amountCents: number; reviewRequired: true; }
export interface FreightPlaceholderDTO { id: string; invoiceId: string; amountCents: number; reviewRequired: true; }
export interface CustomerInvoiceViewDTO { invoiceId: string; status: CommerceInvoiceStatus; invoiceTotalCents: number; currency: "CAD" | "USD"; supplierCostVisible: false; }
