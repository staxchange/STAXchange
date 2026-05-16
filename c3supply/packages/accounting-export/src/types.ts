export type SimplyAccountingExportStatus =
  | "DRAFT"
  | "FINANCE_REVIEW_REQUIRED"
  | "FINANCE_APPROVED"
  | "FILE_GENERATED"
  | "READY_FOR_SIMPLY_ACCOUNTING_EXPORT"
  | "EXPORTED"
  | "CANCELLED";

export type SimplyAccountingExportFileFormat = "CSV_REVIEW_BATCH";

export interface SimplyAccountingCustomerRow {
  customerId: string;
  customerName: string;
  customerEmail?: string;
  billingAddress?: string;
}

export interface SimplyAccountingInvoiceRow {
  invoiceId: string;
  customerId: string;
  invoiceDate: string;
  currency: "CAD" | "USD";
  description: string;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

export interface SimplyAccountingInvoiceLineRow {
  invoiceId: string;
  lineId: string;
  itemCode?: string;
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
  revenueAccount?: string;
}

export interface SimplyAccountingExportBatch {
  id: string;
  batchNumber: string;
  status: SimplyAccountingExportStatus;
  format: SimplyAccountingExportFileFormat;
  customerRows: SimplyAccountingCustomerRow[];
  invoiceRows: SimplyAccountingInvoiceRow[];
  invoiceLineRows: SimplyAccountingInvoiceLineRow[];
  createdAt: string;
  reviewedBy?: string;
}

export interface SimplyAccountingExportFile {
  fileName: string;
  mimeType: "text/csv";
  content: string;
  rowCount: number;
  generatedAt: string;
}

export interface SimplyAccountingBatchManifest {
  batchId: string;
  batchNumber: string;
  status: SimplyAccountingExportStatus;
  format: SimplyAccountingExportFileFormat;
  files: Array<{
    fileName: string;
    rowCount: number;
  }>;
  generatedAt: string;
}
