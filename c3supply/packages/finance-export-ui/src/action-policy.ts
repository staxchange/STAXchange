import type { FinanceExportAction } from "./types";

export function financeExportAvailableActions(status: string): FinanceExportAction[] {
  if (status === "STORED" || status === "DOWNLOAD_APPROVAL_REQUIRED") {
    return ["APPROVE_DOWNLOAD", "REJECT_DOWNLOAD"];
  }

  if (status === "DOWNLOAD_APPROVED") {
    return ["CREATE_SIGNED_DOWNLOAD"];
  }

  if (status === "SIGNED_DOWNLOAD_CREATED") {
    return ["MARK_EXPORTED", "MARK_FAILED", "ADD_RECONCILIATION_NOTE"];
  }

  if (status === "EXPORTED") {
    return ["ADD_RECONCILIATION_NOTE", "ARCHIVE_BATCH"];
  }

  if (status === "FAILED" || status === "DOWNLOAD_REJECTED") {
    return ["ADD_RECONCILIATION_NOTE", "ARCHIVE_BATCH"];
  }

  return [];
}

export function financeExportActionRequiresFinance(action: FinanceExportAction): true {
  void action;
  return true;
}
