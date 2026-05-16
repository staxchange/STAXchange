import type {
  ExportHistoryEventDTO,
  ExportStorageRecordDTO,
  ExportStorageRepository,
  FinanceDownloadApprovalDTO,
  ReconciliationNoteDTO,
  SignedExportDownloadDTO
} from "./types";

interface SupabaseLikeClient {
  from(table: string): {
    insert(value: unknown): {
      select(columns?: string): {
        single(): Promise<{ data: unknown; error: { message: string } | null }>;
      };
    };
  };
}

export class SupabaseExportStorageRepository implements ExportStorageRepository {
  constructor(private readonly client: SupabaseLikeClient) {}

  async storeExportFile(record: ExportStorageRecordDTO): Promise<ExportStorageRecordDTO> {
    const { data, error } = await this.client
      .from("simply_accounting_export_files")
      .insert({
        id: record.id,
        batch_id: record.batchId,
        file_name: record.fileName,
        file_kind: record.fileKind,
        storage_bucket: record.storageBucket,
        storage_path: record.storagePath,
        row_count: record.rowCount,
        status: record.status
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ExportStorageRecordDTO;
  }

  async approveDownload(approval: FinanceDownloadApprovalDTO): Promise<FinanceDownloadApprovalDTO> {
    const { data, error } = await this.client
      .from("simply_accounting_download_approvals")
      .insert({
        id: approval.id,
        batch_id: approval.batchId,
        approved_by: approval.approvedBy,
        status: approval.status,
        reason: approval.reason
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as FinanceDownloadApprovalDTO;
  }

  async createSignedDownload(download: SignedExportDownloadDTO): Promise<SignedExportDownloadDTO> {
    const { data, error } = await this.client
      .from("simply_accounting_signed_downloads")
      .insert({
        id: download.id,
        batch_id: download.batchId,
        file_id: download.fileId,
        url: download.url,
        expires_at: download.expiresAt
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as SignedExportDownloadDTO;
  }

  async addHistoryEvent(event: ExportHistoryEventDTO): Promise<ExportHistoryEventDTO> {
    const { data, error } = await this.client
      .from("simply_accounting_export_history")
      .insert({
        id: event.id,
        batch_id: event.batchId,
        event_type: event.eventType,
        actor_id: event.actorId,
        note: event.note
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ExportHistoryEventDTO;
  }

  async addReconciliationNote(note: ReconciliationNoteDTO): Promise<ReconciliationNoteDTO> {
    const { data, error } = await this.client
      .from("simply_accounting_reconciliation_notes")
      .insert({
        id: note.id,
        batch_id: note.batchId,
        note: note.note,
        created_by: note.createdBy
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    return data as ReconciliationNoteDTO;
  }
}
