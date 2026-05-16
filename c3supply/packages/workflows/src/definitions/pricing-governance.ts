import type { WorkflowDefinition } from "../workflow-types";

export const pricingGovernanceWorkflow: WorkflowDefinition = {
  id: "pricing-governance",
  name: "Pricing and Margin Governance",
  description: "Supplier cost, margin review, pricing approval, and quote pricing lock workflow.",
  initialStatus: "COST_RECORD_CREATED",
  terminalStatuses: ["QUOTE_PRICING_LOCKED", "PRICING_REJECTED"],
  transitions: [
    { from: "COST_RECORD_CREATED", to: "COST_VALIDATED", command: "UpdateSupplierCostRecordCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "COST_VALIDATED", to: "MARGIN_RULE_APPLIED", command: "ApplyMarginRuleCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "MARGIN_RULE_APPLIED", to: "PRICING_REVIEW_REQUIRED", command: "CreatePricingReviewCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PRICING_REVIEW_REQUIRED", to: "PRICING_APPROVED", command: "ApproveQuotePricingCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PRICING_REVIEW_REQUIRED", to: "PRICING_REJECTED", command: "RejectQuotePricingCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PRICING_APPROVED", to: "QUOTE_PRICING_LOCKED", command: "LockQuotePricingCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PRICING_REJECTED", to: "COST_VALIDATED", command: "UpdateSupplierCostRecordCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] }
  ]
};
