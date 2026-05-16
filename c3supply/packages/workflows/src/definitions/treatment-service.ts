import type { WorkflowDefinition } from "../workflow-types";

export const treatmentServiceWorkflow: WorkflowDefinition = {
  id: "treatment-system-service",
  name: "Treatment System Service",
  description:
    "Service request intake, triage, emergency escalation, work order creation, scheduling, technician assignment, and visit completion.",
  initialStatus: "NEW",
  terminalStatuses: ["COMPLETED", "CANCELLED"],
  transitions: [
    {
      from: "NEW",
      to: "TRIAGED",
      command: "TriageServiceRequestCommand",
      allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "NEW",
      to: "ESCALATED",
      command: "EscalateEmergencyServiceCommand",
      allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "TRIAGED",
      to: "WORK_ORDER_CREATED",
      command: "CreateServiceWorkOrderCommand",
      allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "WORK_ORDER_CREATED",
      to: "SCHEDULED",
      command: "ScheduleServiceVisitCommand",
      allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "SCHEDULED",
      to: "ASSIGNED",
      command: "AssignServiceTechnicianCommand",
      allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "ASSIGNED",
      to: "COMPLETED",
      command: "CompleteServiceVisitCommand",
      allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"]
    }
  ]
};
