export type ExportStorageStatus =
  | "PENDING_STORAGE"
  | "STORED"
  | "DOWNLOAD_APPROVAL_REQUIRED"
  | "DOWNLOAD_APPROVED"
  | "SIGNED_DOWNLOAD_CREATED"
  | "EXPORTED"
  | "FAILED"
  | "ARCHIVED";

export type ExportStorageFileKind = "CUSTOMERS_CSV" | "INVOICES_CSV" | "INVOICE_LINES_CSV" | "MANIFEST_JSON";

export interface ExportStorageRecordDTO {
  id: string;
  batchId: string;
  fileName: string;
  fileKind: ExportStorageFileKind;
  storageBucket: string;
  storagePath: string;
  rowCount: number;
  status: ExportStorageStatus;
  createdAt: string;
}

export interface FinanceDownloadApprovalDTO {
  id: string;
  batchId: string;
  approvedBy: string;
  status: "APPROVED" | "REJECTED";
  reason?: string;
  createdAt: string;
}

export interface SignedExportDownloadDTO {
  id: string;
  batchId: string;
  fileId: string;
  url: string;
  expiresAt: string;
  createdAt: string;
}

export interface ExportHistoryEventDTO {
  id: string;
  batchId: string;
  eventType:
    | "FILES_STORED"
    | "DOWNLOAD_APPROVED"
    | "SIGNED_DOWNLOAD_CREATED"
    | "MARKED_EXPORTED"
    | "MARKED_FAILED"
    | "RECONCILIATION_NOTE_ADDED"
    | "ARCHIVED";
  actorId: string;
  note?: string;
  createdAt: string;
}

export interface ReconciliationNoteDTO {
  id: string;
  batchId: string;
  note: string;
  createdBy: string;
  createdAt: string;
}

export interface ExportStorageRepository {
  storeExportFile(record: ExportStorageRecordDTO): Promise<ExportStorageRecordDTO>;
  approveDownload(approval: FinanceDownloadApprovalDTO): Promise<FinanceDownloadApprovalDTO>;
  createSignedDownload(download: SignedExportDownloadDTO): Promise<SignedExportDownloadDTO>;
  addHistoryEvent(event: ExportHistoryEventDTO): Promise<ExportHistoryEventDTO>;
  addReconciliationNote(note: ReconciliationNoteDTO): Promise<ReconciliationNoteDTO>;
}
