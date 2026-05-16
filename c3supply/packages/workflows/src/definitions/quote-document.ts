import type { WorkflowDefinition } from "../workflow-types";

export const quoteDocumentWorkflow: WorkflowDefinition = {
  id: "quote-document",
  name: "Quote Document and Customer Acceptance",
  description: "Approved commerce quote becomes reviewed document, PDF-ready view, share link, customer acceptance, and order creation.",
  initialStatus: "QUOTE_APPROVED",
  terminalStatuses: ["ORDER_CREATED", "EXPIRED"],
  transitions: [
    { from: "QUOTE_APPROVED", to: "DOCUMENT_DRAFTED", command: "CreateQuoteDocumentCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "DOCUMENT_DRAFTED", to: "DOCUMENT_REVIEW_REQUIRED", command: "CreateQuoteDocumentCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "DOCUMENT_REVIEW_REQUIRED", to: "DOCUMENT_APPROVED", command: "ApproveQuoteDocumentCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] },
    { from: "DOCUMENT_APPROVED", to: "PDF_READY", command: "GenerateQuotePdfCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PDF_READY", to: "SHARE_LINK_CREATED", command: "CreateQuoteShareLinkCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SHARE_LINK_CREATED", to: "QUOTE_VIEWED", command: "RecordQuoteViewedCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_VIEWED", to: "CUSTOMER_ACCEPTED", command: "AcceptCustomerQuoteCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "CUSTOMER_ACCEPTED", to: "ORDER_CREATED", command: "CreateOrderFromCustomerAcceptanceCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_VIEWED", to: "REVISION_REQUESTED", command: "RequestQuoteRevisionCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "REVISION_REQUESTED", to: "DOCUMENT_DRAFTED", command: "CreateQuoteDocumentCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SHARE_LINK_CREATED", to: "EXPIRED", command: "ExpireQuoteCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
