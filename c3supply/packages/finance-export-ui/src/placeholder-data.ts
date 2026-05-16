import type { FinanceExportScreenModel } from "./types";
import { financeExportAvailableActions } from "./action-policy";

export function createPlaceholderFinanceExportScreenModel(batchId = "batch-placeholder"): FinanceExportScreenModel {
  const status = "DOWNLOAD_APPROVAL_REQUIRED";

  return {
    batch: {
      id: batchId,
      batchNumber: "SIMPLY-EXPORT-001",
      status,
      invoiceCount: 2,
      fileCount: 4,
      createdAt: new Date().toISOString(),
      reviewedBy: "finance-placeholder"
    },
    files: [
      {
        id: "file-customers",
        fileName: "simply-accounting-SIMPLY-EXPORT-001-customers.csv",
        fileKind: "CUSTOMERS_CSV",
        rowCount: 1,
        status: "STORED",
        storagePath: "simply-accounting/SIMPLY-EXPORT-001/customers_csv/customers.csv"
      },
      {
        id: "file-invoices",
        fileName: "simply-accounting-SIMPLY-EXPORT-001-invoices.csv",
        fileKind: "INVOICES_CSV",
        rowCount: 2,
        status: "STORED",
        storagePath: "simply-accounting/SIMPLY-EXPORT-001/invoices_csv/invoices.csv"
      },
      {
        id: "file-lines",
        fileName: "simply-accounting-SIMPLY-EXPORT-001-invoice-lines.csv",
        fileKind: "INVOICE_LINES_CSV",
        rowCount: 4,
        status: "STORED",
        storagePath: "simply-accounting/SIMPLY-EXPORT-001/invoice_lines_csv/invoice-lines.csv"
      },
      {
        id: "file-manifest",
        fileName: "simply-accounting-SIMPLY-EXPORT-001-manifest.json",
        fileKind: "MANIFEST_JSON",
        rowCount: 1,
        status: "STORED",
        storagePath: "simply-accounting/SIMPLY-EXPORT-001/manifest_json/manifest.json"
      }
    ],
    history: [
      {
        id: "history-1",
        eventType: "FILES_STORED",
        actorId: "finance-placeholder",
        note: "Export files generated and stored for finance review.",
        createdAt: new Date().toISOString()
      }
    ],
    availableActions: financeExportAvailableActions(status)
  };
}
