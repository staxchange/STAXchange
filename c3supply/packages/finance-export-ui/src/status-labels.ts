export function financeExportStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    FILE_GENERATED: "File generated",
    STORED: "Stored",
    DOWNLOAD_APPROVAL_REQUIRED: "Download approval required",
    DOWNLOAD_APPROVED: "Download approved",
    DOWNLOAD_REJECTED: "Download rejected",
    SIGNED_DOWNLOAD_CREATED: "Signed download created",
    EXPORTED: "Exported",
    FAILED: "Failed",
    RECONCILIATION_NOTE_ADDED: "Reconciliation note added",
    ARCHIVED: "Archived"
  };

  return labels[status] ?? status;
}

export function financeExportStatusSeverity(status: string): "neutral" | "warning" | "success" | "danger" {
  if (status === "FAILED" || status === "DOWNLOAD_REJECTED") return "danger";
  if (status === "DOWNLOAD_APPROVAL_REQUIRED") return "warning";
  if (status === "EXPORTED" || status === "ARCHIVED") return "success";
  return "neutral";
}
