import type { SimplyAccountingExportBatch } from "./types";

export function createSampleSimplyAccountingBatch(): SimplyAccountingExportBatch {
  return {
    id: "sample-simply-accounting-batch",
    batchNumber: "SAMPLE-001",
    status: "FINANCE_APPROVED",
    format: "CSV_REVIEW_BATCH",
    customerRows: [
      {
        customerId: "customer-001",
        customerName: "Sample Customer",
        customerEmail: "customer@example.com",
        billingAddress: "Pending review"
      }
    ],
    invoiceRows: [
      {
        invoiceId: "invoice-001",
        customerId: "customer-001",
        invoiceDate: "2026-05-13",
        currency: "CAD",
        description: "Service invoice placeholder",
        subtotalCents: 10000,
        taxCents: 500,
        totalCents: 10500
      }
    ],
    invoiceLineRows: [
      {
        invoiceId: "invoice-001",
        lineId: "line-001",
        itemCode: "SERVICE",
        description: "Service labor placeholder",
        quantity: 1,
        unitPriceCents: 10000,
        totalCents: 10000,
        revenueAccount: "Pending finance mapping"
      }
    ],
    createdAt: new Date().toISOString(),
    reviewedBy: "finance-placeholder"
  };
}
