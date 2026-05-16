import type { ProductDTO } from "./types";

export const sampleCommerceProducts: ProductDTO[] = [
  { id: "dwg-prod-iron-001", slug: "iron-removal-system", name: "Iron Removal System", categorySlug: "iron-removal", summary: "Quote-first iron removal system.", approvalStatus: "PUBLISHED", availability: "QUOTE_ONLY", quoteRequired: true, checkoutEligible: false },
  { id: "dwg-prod-filter-001", slug: "replacement-filter-cartridge", name: "Replacement Filter Cartridge", categorySlug: "filters-cartridges", summary: "Checkout-lite eligible replacement cartridge placeholder.", approvalStatus: "PUBLISHED", availability: "IN_STOCK", quoteRequired: false, checkoutEligible: true }
];
