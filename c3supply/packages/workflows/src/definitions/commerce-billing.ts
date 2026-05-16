import type { WorkflowDefinition } from "../workflow-types";
export const commerceBillingWorkflow: WorkflowDefinition = {
  id: "commerce-billing", name: "Commerce Billing", description: "Finance-reviewed invoice and billing packet workflow.",
  initialStatus: "INVOICE_DRAFT_CREATED", terminalStatuses: ["READY_FOR_SIMPLY_ACCOUNTING_EXPORT", "INVOICE_CLOSED"],
  transitions: [
    { from: "INVOICE_DRAFT_CREATED", to: "PAYMENT_RECONCILIATION_REQUIRED", command: "RecordPaymentReconciliationCommand", allowedRoles: ["SALES", "OPS", "FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_RECONCILIATION_REQUIRED", to: "TAX_FREIGHT_REVIEW_REQUIRED", command: "RecordTaxFreightPlaceholderCommand", allowedRoles: ["SALES", "OPS", "FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "TAX_FREIGHT_REVIEW_REQUIRED", to: "FINANCE_REVIEW_REQUIRED", command: "SubmitCommerceInvoiceForFinanceReviewCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "FINANCE_REVIEW_REQUIRED", to: "INVOICE_APPROVED", command: "ApproveCommerceInvoiceCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "FINANCE_REVIEW_REQUIRED", to: "INVOICE_REJECTED", command: "RejectCommerceInvoiceCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "INVOICE_REJECTED", to: "INVOICE_DRAFT_CREATED", command: "CreateCommerceInvoiceDraftCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "INVOICE_APPROVED", to: "BILLING_PACKET_CREATED", command: "CreateCommerceBillingPacketCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] }
  ]
};
