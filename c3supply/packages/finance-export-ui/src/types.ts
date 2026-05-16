export type FinanceExportAction =
  | "APPROVE_DOWNLOAD"
  | "REJECT_DOWNLOAD"
  | "CREATE_SIGNED_DOWNLOAD"
  | "MARK_EXPORTED"
  | "MARK_FAILED"
  | "ADD_RECONCILIATION_NOTE"
  | "ARCHIVE_BATCH";

export interface FinanceExportBatchView {
  id: string;
  batchNumber: string;
  status: string;
  invoiceCount: number;
  fileCount: number;
  createdAt: string;
  reviewedBy?: string;
}

export interface FinanceExportFileView {
  id: string;
  fileName: string;
  fileKind: string;
  rowCount: number;
  status: string;
  storagePath: string;
}

export interface FinanceExportHistoryView {
  id: string;
  eventType: string;
  actorId: string;
  note?: string;
  createdAt: string;
}

export interface FinanceExportScreenModel {
  batch: FinanceExportBatchView;
  files: FinanceExportFileView[];
  history: FinanceExportHistoryView[];
  availableActions: FinanceExportAction[];
}
