import type { WorkflowDefinition } from "../workflow-types";

export const sageExportWorkflow: WorkflowDefinition = {
  id: "sage-export",
  name: "Sage Export",
  description: "Batch eligible orders for future Simply Accounting export.",
  initialStatus: "READY",
  terminalStatuses: ["EXPORTED", "FAILED"],
  transitions: [
    { from: "READY", to: "BATCH_CREATED", command: "ExportSageBatchCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "BATCH_CREATED", to: "EXPORTED", command: "MarkSageBatchExportedCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
