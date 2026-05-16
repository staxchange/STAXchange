import type { WorkflowDefinition } from "../workflow-types";

export const productPublicationWorkflow: WorkflowDefinition = {
  id: "product-publication",
  name: "Product Publication",
  description: "Draft, review, approve, publish, or quarantine catalog records.",
  initialStatus: "DRAFT",
  terminalStatuses: ["PUBLISHED", "QUARANTINED"],
  transitions: [
    { from: "DRAFT", to: "REVIEW", command: "SubmitProductForReviewCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "REVIEW", to: "APPROVED", command: "ApproveProductLaunchCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "APPROVED", to: "PUBLISHED", command: "PublishProductCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "DRAFT", to: "QUARANTINED", command: "QuarantineProductCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "REVIEW", to: "QUARANTINED", command: "QuarantineProductCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "APPROVED", to: "QUARANTINED", command: "QuarantineProductCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "PUBLISHED", to: "QUARANTINED", command: "QuarantineProductCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] }
  ]
};
