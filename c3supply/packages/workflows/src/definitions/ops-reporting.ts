import type { WorkflowDefinition } from "../workflow-types";

export const opsReportingWorkflow: WorkflowDefinition = {
  id: "ops-reporting",
  name: "Operational Reporting Snapshot",
  description: "Governed KPI snapshot and ops report snapshot creation.",
  initialStatus: "REQUESTED",
  terminalStatuses: ["OPS_REPORT_CREATED"],
  transitions: [
    { from: "REQUESTED", to: "SERVICE_KPI_CREATED", command: "GenerateServiceKpiSnapshotCommand", allowedRoles: ["REPORTING", "ADMIN", "SUPER_ADMIN"] },
    { from: "SERVICE_KPI_CREATED", to: "OPS_REPORT_CREATED", command: "CreateOpsReportSnapshotCommand", allowedRoles: ["REPORTING", "ADMIN", "SUPER_ADMIN"] }
  ]
};
