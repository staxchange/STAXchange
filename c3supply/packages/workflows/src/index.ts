export * from "./workflow-types";
export * from "./workflow-engine";
export * from "./definitions/product-publication";
export * from "./definitions/pricing-approval";
export * from "./definitions/quote-first";
export * from "./definitions/checkout";
export * from "./definitions/fulfillment";
export * from "./definitions/sage-export";
export * from "./definitions/tech-support";
export * from "./definitions/treatment-service";
export * from "./definitions/technician-work-order";

import { productPublicationWorkflow } from "./definitions/product-publication";
import { pricingApprovalWorkflow } from "./definitions/pricing-approval";
import { quoteFirstWorkflow } from "./definitions/quote-first";
import { checkoutWorkflow } from "./definitions/checkout";
import { fulfillmentWorkflow } from "./definitions/fulfillment";
import { sageExportWorkflow } from "./definitions/sage-export";
import { techSupportWorkflow } from "./definitions/tech-support";
import { treatmentServiceWorkflow } from "./definitions/treatment-service";
import { technicianWorkOrderWorkflow } from "./definitions/technician-work-order";

export const workflowDefinitions = [
  productPublicationWorkflow,
  pricingApprovalWorkflow,
  quoteFirstWorkflow,
  checkoutWorkflow,
  fulfillmentWorkflow,
  sageExportWorkflow,
  techSupportWorkflow,
  treatmentServiceWorkflow,
  technicianWorkOrderWorkflow
];

export const workflowSummaries = workflowDefinitions.map((workflow) => ({
  id: workflow.id,
  name: workflow.name,
  description: workflow.description
}));

export * from "./definitions/service-billing";

import { serviceBillingWorkflow } from "./definitions/service-billing";
export const serviceBillingWorkflowDefinition = serviceBillingWorkflow;
export * from "./definitions/customer-portal";
export * from "./definitions/maintenance-plan";
export * from "./definitions/notification-delivery";
export * from "./definitions/ops-reporting";

export * from "./definitions/commerce-quote";

export * from "./definitions/photo-quote";

export * from "./definitions/quote-document";

export * from "./definitions/pricing-governance";

export * from "./definitions/quote-delivery";

export * from "./definitions/payments";

export * from "./definitions/supplier-purchasing";

export * from "./definitions/commerce-billing";
export * from "./definitions/accounting-handoff";
