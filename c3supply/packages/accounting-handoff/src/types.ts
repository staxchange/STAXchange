export type AccountingExportStatus = "HANDOFF_DRAFTED" | "EXPORT_REVIEW_REQUIRED" | "READY_FOR_SIMPLY_ACCOUNTING_EXPORT" | "EXPORTED_MANUALLY" | "RECONCILED" | "EXPORT_FAILED";
export interface AccountingHandoffDTO { id: string; invoiceId: string; billingPacketId: string; status: AccountingExportStatus; createdAt: string; }
export interface SimplyAccountingExportReadinessDTO { id: string; handoffId: string; ready: boolean; fileBatchPrepOnly: true; directSync: false; }
export interface AccountingReconciliationNoteDTO { id: string; handoffId: string; note: string; createdBy: string; createdAt: string; }
