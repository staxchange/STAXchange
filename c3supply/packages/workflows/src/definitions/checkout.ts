import type { WorkflowDefinition } from "../workflow-types";

export const checkoutWorkflow: WorkflowDefinition = {
  id: "checkout",
  name: "Commodity Checkout",
  description: "Checkout-eligible commodity items only. Large systems remain quote-first.",
  initialStatus: "EMPTY",
  terminalStatuses: ["ORDER_CREATED", "ABANDONED"],
  transitions: [
    { from: "EMPTY", to: "ACTIVE", command: "AddToCartCommand", allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "ACTIVE", to: "CHECKOUT_CREATED", command: "CreateCheckoutSessionCommand", allowedRoles: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"] },
    { from: "CHECKOUT_CREATED", to: "ORDER_CREATED", command: "CreateOrderFromStripeCommand", allowedRoles: ["ADMIN", "SUPER_ADMIN"] }
  ]
};
