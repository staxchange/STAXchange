import type { GoldenPathFixtureDTO, GoldenPathStepDTO } from "./types";

export const coreGoldenPathSteps: GoldenPathStepDTO[] = [
  { id: "catalog", label: "Catalog/product intent", commandGatewayRequired: false, publicSurfaceSafe: true },
  { id: "cart", label: "Cart intent", requiredPriorState: "catalog", commandGatewayRequired: true, publicSurfaceSafe: true },
  { id: "quote-request", label: "Quote request", requiredPriorState: "cart", commandGatewayRequired: true, publicSurfaceSafe: true },
  { id: "pricing-review", label: "Pricing and margin review", requiredPriorState: "quote-request", commandGatewayRequired: true, publicSurfaceSafe: false },
  { id: "quote-document", label: "Quote document", requiredPriorState: "pricing-review", commandGatewayRequired: true, publicSurfaceSafe: true },
  { id: "quote-delivery", label: "Quote delivery", requiredPriorState: "quote-document", commandGatewayRequired: true, publicSurfaceSafe: true },
  { id: "payment", label: "Payment request / Stripe checkout scaffold", requiredPriorState: "quote-delivery", commandGatewayRequired: true, publicSurfaceSafe: true },
  { id: "fulfillment", label: "Fulfillment and supplier PO prep", requiredPriorState: "payment", commandGatewayRequired: true, publicSurfaceSafe: false },
  { id: "billing", label: "Invoice and billing packet", requiredPriorState: "fulfillment", commandGatewayRequired: true, publicSurfaceSafe: true },
  { id: "accounting-handoff", label: "Simply Accounting export handoff", requiredPriorState: "billing", commandGatewayRequired: true, publicSurfaceSafe: false }
];

export const goldenPathFixtures: GoldenPathFixtureDTO[] = [
  { id: "dwg-catalog-cart-quote", name: "DWG catalog/cart quote path", steps: coreGoldenPathSteps.slice(0, 3) },
  { id: "dwg-photo-quote", name: "DWG operator photo quote path", steps: [{ id: "photo-intake", label: "Photo quote intake", commandGatewayRequired: true, publicSurfaceSafe: false }, ...coreGoldenPathSteps.slice(2, 6)] },
  { id: "c3-public-quote", name: "C3 public quote path", steps: coreGoldenPathSteps.slice(0, 6) },
  { id: "quote-document-delivery", name: "Quote document delivery path", steps: coreGoldenPathSteps.slice(3, 6) },
  { id: "customer-acceptance", name: "Customer acceptance path", steps: coreGoldenPathSteps.slice(5, 7) },
  { id: "payment-request-stripe", name: "Payment request / Stripe checkout scaffold path", steps: coreGoldenPathSteps.slice(6, 7) },
  { id: "fulfillment-supplier-po", name: "Fulfillment / supplier PO prep path", steps: coreGoldenPathSteps.slice(7, 8) },
  { id: "billing-accounting-handoff", name: "Billing / accounting handoff path", steps: coreGoldenPathSteps.slice(8, 10) }
];

export function goldenPathStepIds(): string[] {
  return coreGoldenPathSteps.map((step) => step.id);
}
