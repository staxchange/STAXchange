import type { WorkflowDefinition } from "../workflow-types";

export const serviceBillingWorkflow: WorkflowDefinition = {
  id: "service-billing",
  name: "Service Billing and Simply Accounting Export Prep",
  description:
    "Manager-approved closeout moves through labor, parts, invoice draft, finance review, billing packet, and Simply Accounting export preparation.",
  initialStatus: "SERVICE_CLOSEOUT_APPROVED",
  terminalStatuses: ["READY_FOR_SIMPLY_ACCOUNTING_EXPORT", "INVOICE_REJECTED"],
  transitions: [
    {
      from: "SERVICE_CLOSEOUT_APPROVED",
      to: "LABOR_RECORDED",
      command: "CreateLaborEntryCommand",
      allowedRoles: ["TECHNICIAN", "OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "LABOR_RECORDED",
      to: "PARTS_RECORDED",
      command: "AddServicePartUsedCommand",
      allowedRoles: ["TECHNICIAN", "OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "PARTS_RECORDED",
      to: "INVOICE_DRAFT_CREATED",
      command: "CreateServiceInvoiceDraftCommand",
      allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "INVOICE_DRAFT_CREATED",
      to: "INVOICE_REVIEW_REQUIRED",
      command: "SubmitInvoiceForReviewCommand",
      allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "INVOICE_REVIEW_REQUIRED",
      to: "INVOICE_APPROVED",
      command: "ApproveServiceInvoiceCommand",
      allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "INVOICE_REVIEW_REQUIRED",
      to: "INVOICE_REJECTED",
      command: "RejectServiceInvoiceCommand",
      allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "INVOICE_APPROVED",
      to: "BILLING_PACKET_CREATED",
      command: "CreateBillingPacketCommand",
      allowedRoles: ["FINANCE", "OPS", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "BILLING_PACKET_CREATED",
      to: "SIMPLY_ACCOUNTING_EXPORT_BATCHED",
      command: "CreateSimplyAccountingExportBatchCommand",
      allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"]
    },
    {
      from: "SIMPLY_ACCOUNTING_EXPORT_BATCHED",
      to: "READY_FOR_SIMPLY_ACCOUNTING_EXPORT",
      command: "MarkSimplyAccountingExportBatchReadyCommand",
      allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"]
    }
  ]
};
