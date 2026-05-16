import type { WorkflowDefinition } from "../workflow-types";

export const paymentsWorkflow: WorkflowDefinition = {
  id: "payments",
  name: "Stripe Deposit and Payment Capture",
  description: "Accepted quote to reviewed payment request, Stripe checkout, payment event record, and close workflow.",
  initialStatus: "CUSTOMER_ACCEPTED",
  terminalStatuses: ["PAYMENT_CLOSED", "PAYMENT_FAILED", "PAYMENT_CANCELED"],
  transitions: [
    { from: "CUSTOMER_ACCEPTED", to: "PAYMENT_REQUEST_DRAFTED", command: "CreatePaymentRequestCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_REQUEST_DRAFTED", to: "PAYMENT_REVIEW_REQUIRED", command: "SubmitPaymentRequestForReviewCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_REVIEW_REQUIRED", to: "PAYMENT_REQUEST_APPROVED", command: "ApprovePaymentRequestCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_REQUEST_APPROVED", to: "CHECKOUT_SESSION_CREATED", command: "CreateStripeCheckoutSessionCommand", allowedRoles: ["CUSTOMER", "PUBLIC", "FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "CHECKOUT_SESSION_CREATED", to: "PAYMENT_PENDING", command: "RecordPaymentPendingCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_PENDING", to: "PAYMENT_SUCCEEDED", command: "RecordPaymentSucceededCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_PENDING", to: "PAYMENT_FAILED", command: "RecordPaymentFailedCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "CHECKOUT_SESSION_CREATED", to: "PAYMENT_CANCELED", command: "RecordPaymentCanceledCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_SUCCEEDED", to: "REFUND_REVIEW_REQUESTED", command: "RequestRefundReviewCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] },
    { from: "PAYMENT_SUCCEEDED", to: "PAYMENT_CLOSED", command: "ClosePaymentRequestCommand", allowedRoles: ["FINANCE", "ADMIN", "SUPER_ADMIN"] }
  ]
};
