import type { WorkflowDefinition } from "../workflow-types";

export const pricingApprovalWorkflow: WorkflowDefinition = {
  id: "pricing-approval",
  name: "Pricing Approval",
  description: "Validate cost, margin, approval state, and freshness before publication.",
  initialStatus: "DRAFT",
  terminalStatuses: ["APPROVED", "REJECTED", "STALE"],
  transitions: [
    { from: "DRAFT", to: "VALIDATED", command: "ValidateProductPricingCommand", allowedRoles: ["SALES", "ADMIN", "SUPER_ADMIN"] },
    { from: "VALIDATED", to: "APPROVED", command: "ApproveRetailPriceCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "APPROVED", to: "STALE", command: "MarkPricingStaleCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] }
  ]
};
