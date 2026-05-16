import type { WorkflowDefinition } from "../workflow-types";

export const commerceQuoteWorkflow: WorkflowDefinition = {
  id: "commerce-quote",
  name: "Commerce Quote Workflow",
  description: "Governed cart intent to quote review and accepted quote to order draft.",
  initialStatus: "CART_CREATED",
  terminalStatuses: ["ORDER_CREATED"],
  transitions: [
    { from: "CART_CREATED", to: "CART_UPDATED", command: "AddCartItemCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "CART_UPDATED", to: "QUOTE_REQUESTED", command: "ConvertCartToQuoteRequestCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_REQUESTED", to: "QUOTE_DRAFTED", command: "DraftCommerceQuoteCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_DRAFTED", to: "HUMAN_REVIEW_REQUIRED", command: "SubmitCommerceQuoteForReviewCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "HUMAN_REVIEW_REQUIRED", to: "QUOTE_APPROVED", command: "ApproveCommerceQuoteCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "HUMAN_REVIEW_REQUIRED", to: "QUOTE_REVISION_REQUIRED", command: "DraftCommerceQuoteCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_REVISION_REQUIRED", to: "QUOTE_DRAFTED", command: "DraftCommerceQuoteCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_APPROVED", to: "QUOTE_SENT", command: "SendCommerceQuoteCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_SENT", to: "QUOTE_ACCEPTED", command: "AcceptCommerceQuoteCommand", allowedRoles: ["CUSTOMER", "SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_ACCEPTED", to: "ORDER_CREATED", command: "CreateOrderFromAcceptedQuoteCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
