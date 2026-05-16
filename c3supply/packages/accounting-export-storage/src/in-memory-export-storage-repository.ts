import type {
  ExportHistoryEventDTO,
  ExportStorageRecordDTO,
  ExportStorageRepository,
  FinanceDownloadApprovalDTO,
  ReconciliationNoteDTO,
  SignedExportDownloadDTO
} from "./types";

export class InMemoryExportStorageRepository implements ExportStorageRepository {
  readonly files: ExportStorageRecordDTO[] = [];
  readonly approvals: FinanceDownloadApprovalDTO[] = [];
  readonly downloads: SignedExportDownloadDTO[] = [];
  readonly history: ExportHistoryEventDTO[] = [];
  readonly notes: ReconciliationNoteDTO[] = [];

  async storeExportFile(record: ExportStorageRecordDTO): Promise<ExportStorageRecordDTO> {
    this.files.push(record);
    return record;
  }

  async approveDownload(approval: FinanceDownloadApprovalDTO): Promise<FinanceDownloadApprovalDTO> {
    this.approvals.push(approval);
    return approval;
  }

  async createSignedDownload(download: SignedExportDownloadDTO): Promise<SignedExportDownloadDTO> {
    this.downloads.push(download);
    return download;
  }

  async addHistoryEvent(event: ExportHistoryEventDTO): Promise<ExportHistoryEventDTO> {
    this.history.push(event);
    return event;
  }

  async addReconciliationNote(note: ReconciliationNoteDTO): Promise<ReconciliationNoteDTO> {
    this.notes.push(note);
    return note;
  }
}
