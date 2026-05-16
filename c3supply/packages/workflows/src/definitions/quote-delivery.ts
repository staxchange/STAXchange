import type { WorkflowDefinition } from "../workflow-types";

export const quoteDeliveryWorkflow: WorkflowDefinition = {
  id: "quote-delivery",
  name: "Quote Delivery",
  description: "Approved/locked quote delivery, stored document, secure share token, notification, customer actions, and closeout.",
  initialStatus: "DOCUMENT_APPROVED",
  terminalStatuses: ["DELIVERY_CLOSED", "DELIVERY_FAILED", "DELIVERY_EXPIRED"],
  transitions: [
    { from: "DOCUMENT_APPROVED", to: "DELIVERY_DRAFTED", command: "CreateQuoteDeliveryCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "DELIVERY_DRAFTED", to: "DOCUMENT_STORED", command: "StoreQuoteDocumentSnapshotCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "DOCUMENT_STORED", to: "SHARE_LINK_READY", command: "CreateQuoteDeliveryShareTokenCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SHARE_LINK_READY", to: "CUSTOMER_NOTIFIED", command: "SendQuoteNotificationCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "CUSTOMER_NOTIFIED", to: "QUOTE_VIEWED", command: "RecordCustomerQuoteViewCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_VIEWED", to: "CUSTOMER_ACCEPTED", command: "RecordCustomerQuoteAcceptanceCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "CUSTOMER_ACCEPTED", to: "DELIVERY_CLOSED", command: "CloseQuoteDeliveryCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUOTE_VIEWED", to: "REVISION_REQUESTED", command: "RecordCustomerQuoteRevisionRequestCommand", allowedRoles: ["PUBLIC", "CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "REVISION_REQUESTED", to: "DELIVERY_DRAFTED", command: "CreateQuoteDeliveryCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "CUSTOMER_NOTIFIED", to: "DELIVERY_FAILED", command: "MarkQuoteDeliveryFailedCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "SHARE_LINK_READY", to: "DELIVERY_EXPIRED", command: "ExpireQuoteDeliveryCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] }
  ]
};
