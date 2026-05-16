import type { WorkflowDefinition } from "../workflow-types";

export const quoteFirstWorkflow: WorkflowDefinition = {
  id: "quote-first",
  name: "Quote-first Sales",
  description: "Public request, sales review, human validation, quote send, acceptance, and fulfillment handoff.",
  initialStatus: "NEW",
  terminalStatuses: ["ACCEPTED", "DECLINED"],
  transitions: [
    { from: "NEW", to: "REVIEWING", command: "CreateQuoteRequestCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "ADMIN", "SUPER_ADMIN"] },
    { from: "REVIEWING", to: "DRAFTED", command: "DraftQuoteCommand", allowedRoles: ["SALES", "ADMIN", "SUPER_ADMIN"] },
    { from: "DRAFTED", to: "SENT", command: "SendQuoteCommand", allowedRoles: ["SALES", "ADMIN", "SUPER_ADMIN"] },
    { from: "SENT", to: "ACCEPTED", command: "AcceptQuoteCommand", allowedRoles: ["CUSTOMER", "SALES", "ADMIN", "SUPER_ADMIN"] }
  ]
};
