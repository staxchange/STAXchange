import type { WorkflowDefinition } from "../workflow-types";

export const notificationDeliveryWorkflow: WorkflowDefinition = {
  id: "notification-delivery",
  name: "Notification Delivery",
  description: "Customer notification preference creation, queueing, dispatch, and sent marking.",
  initialStatus: "PREFERENCE_CREATED",
  terminalStatuses: ["SENT", "FAILED"],
  transitions: [
    { from: "PREFERENCE_CREATED", to: "QUEUED", command: "QueueCustomerNotificationCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "QUEUED", to: "SENT", command: "MarkNotificationSentCommand", allowedRoles: ["OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
