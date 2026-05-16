import type { WorkflowDefinition } from "../workflow-types";

export const customerPortalWorkflow: WorkflowDefinition = {
  id: "customer-portal",
  name: "Customer Portal Access",
  description: "Customer portal session, verified system access, notification preferences, and service-history views.",
  initialStatus: "REQUESTED",
  terminalStatuses: ["ACTIVE", "REVOKED"],
  transitions: [
    { from: "REQUESTED", to: "SESSION_CREATED", command: "CreateCustomerPortalSessionCommand", allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "SESSION_CREATED", to: "SYSTEM_LINKED", command: "LinkCustomerSystemCommand", allowedRoles: ["SERVICE_MANAGER", "ADMIN", "SUPER_ADMIN"] },
    { from: "SYSTEM_LINKED", to: "ACTIVE", command: "UpdateCustomerNotificationPreferencesCommand", allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"] }
  ]
};
