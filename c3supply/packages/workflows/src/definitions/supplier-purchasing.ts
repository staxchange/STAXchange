import type { WorkflowDefinition } from "../workflow-types";
export const supplierPurchasingWorkflow: WorkflowDefinition = {
  id: "supplier-purchasing", name: "Supplier PO Prep", description: "Draft, review, approve, and manually send supplier purchase order preparation.",
  initialStatus: "SUPPLIER_PO_DRAFTED", terminalStatuses: ["SUPPLIER_PO_SENT_MANUALLY", "SUPPLIER_PO_REJECTED"],
  transitions: [
    { from: "SUPPLIER_PO_DRAFTED", to: "SUPPLIER_PO_REVIEW_REQUIRED", command: "SubmitSupplierPurchaseOrderForReviewCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SUPPLIER_PO_REVIEW_REQUIRED", to: "SUPPLIER_PO_APPROVED", command: "ApproveSupplierPurchaseOrderCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SUPPLIER_PO_REVIEW_REQUIRED", to: "SUPPLIER_PO_REJECTED", command: "RejectSupplierPurchaseOrderCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SUPPLIER_PO_REVIEW_REQUIRED", to: "SUPPLIER_PO_REVISION_REQUIRED", command: "RequestSupplierPORevisionCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SUPPLIER_PO_REVISION_REQUIRED", to: "SUPPLIER_PO_DRAFTED", command: "DraftSupplierPurchaseOrderCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SUPPLIER_PO_APPROVED", to: "DROPSHIP_REQUEST_PREPARED", command: "PrepareDropshipRequestCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "DROPSHIP_REQUEST_PREPARED", to: "SUPPLIER_PO_SENT_MANUALLY", command: "MarkSupplierPOSentManuallyCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
