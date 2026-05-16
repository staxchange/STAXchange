import type { WorkflowDefinition } from "../workflow-types";

export const techSupportWorkflow: WorkflowDefinition = {
  id: "tech-support",
  name: "Tech Support Human Handoff",
  description: "AI support intake, deterministic escalation checks, human review, assignment, and closure.",
  initialStatus: "NEW",
  terminalStatuses: ["RESOLVED", "CLOSED"],
  transitions: [
    { from: "NEW", to: "AI_TRIAGE", command: "CreateSupportConversationCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "AI_TRIAGE", to: "AI_TRIAGE", command: "SendSupportMessageCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "AI_TRIAGE", to: "HUMAN_REVIEW_REQUIRED", command: "CreateSupportTicketCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "HUMAN_REVIEW_REQUIRED", to: "ASSIGNED", command: "AssignSupportTicketCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "ASSIGNED", to: "CLOSED", command: "CloseSupportTicketCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
