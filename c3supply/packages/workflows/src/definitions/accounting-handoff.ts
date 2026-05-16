import type { WorkflowDefinition } from "../workflow-types";
export const accountingHandoffWorkflow: WorkflowDefinition = {
  id: "accounting-handoff", name: "Accounting Handoff", description: "Simply Accounting export prep handoff workflow.",
  initialStatus: "HANDOFF_DRAFTED", terminalStatuses: ["RECONCILED", "EXPORT_FAILED"],
  transitions: [
    { from: "HANDOFF_DRAFTED", to: "EXPORT_REVIEW_REQUIRED", command: "SubmitAccountingExportReviewCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "EXPORT_REVIEW_REQUIRED", to: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT", command: "MarkReadyForSimplyAccountingExportCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT", to: "EXPORTED_MANUALLY", command: "MarkAccountingExportedManuallyCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "EXPORTED_MANUALLY", to: "RECONCILED", command: "AddAccountingReconciliationNoteCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT", to: "EXPORT_FAILED", command: "MarkAccountingExportFailedCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] }
  ]
};
