import type { WorkflowDefinition } from "../workflow-types";

export const maintenancePlanWorkflow: WorkflowDefinition = {
  id: "maintenance-plan",
  name: "Maintenance Plan",
  description: "Maintenance plan creation, activation, recurring visit scheduling, renewal, and cancellation.",
  initialStatus: "DRAFT",
  terminalStatuses: ["CANCELLED", "EXPIRED"],
  transitions: [
    { from: "DRAFT", to: "PLAN_CREATED", command: "CreateMaintenancePlanCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PLAN_CREATED", to: "ACTIVE", command: "ActivateMaintenancePlanCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "ACTIVE", to: "VISIT_SCHEDULED", command: "ScheduleMaintenancePlanVisitCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "VISIT_SCHEDULED", to: "RENEWED", command: "RenewMaintenancePlanCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "ACTIVE", to: "CANCELLED", command: "CancelMaintenancePlanCommand", allowedRoles: ["SERVICE_MANAGER", "ADMIN", "SUPER_ADMIN"] }
  ]
};
