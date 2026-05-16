import type { WorkflowDefinition } from "../workflow-types";
export const fulfillmentWorkflow: WorkflowDefinition = {
  id: "fulfillment", name: "Order Fulfillment", description: "Payment handoff to human-reviewed fulfillment and customer-safe shipment status.",
  initialStatus: "FULFILLMENT_REVIEW_REQUIRED", terminalStatuses: ["FULFILLMENT_CLOSED", "FULFILLMENT_BLOCKED"],
  transitions: [
    { from: "FULFILLMENT_REVIEW_REQUIRED", to: "FULFILLMENT_PLAN_CREATED", command: "CreateFulfillmentPlanCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "FULFILLMENT_PLAN_CREATED", to: "INVENTORY_OR_DROPSHIP_DECISION_REQUIRED", command: "RecordInventoryOrDropshipDecisionCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "INVENTORY_OR_DROPSHIP_DECISION_REQUIRED", to: "FULFILLMENT_REQUEST_CREATED", command: "CreateFulfillmentRequestCommand", allowedRoles: ["SALES", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "FULFILLMENT_REQUEST_CREATED", to: "SHIPMENT_PENDING", command: "MarkShipmentPendingCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SHIPMENT_PENDING", to: "SHIPMENT_CONFIRMED", command: "RecordShipmentConfirmationCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "SHIPMENT_CONFIRMED", to: "CUSTOMER_NOTIFIED", command: "NotifyCustomerFulfillmentCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "CUSTOMER_NOTIFIED", to: "FULFILLMENT_CLOSED", command: "CloseFulfillmentCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "FULFILLMENT_REVIEW_REQUIRED", to: "FULFILLMENT_BLOCKED", command: "BlockFulfillmentCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
