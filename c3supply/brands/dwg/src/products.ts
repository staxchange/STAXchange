import type { ProductDTO } from "@stax/core-contracts";

export const dwgProducts: ProductDTO[] = [
  {
    id: "dwg-prod-iron-001",
    slug: "iron-removal-system",
    name: "Iron Removal System",
    categorySlug: "iron-removal",
    summary: "Quote-first iron removal system placeholder.",
    status: "PUBLISHED",
    quoteRequired: true
  },
  {
    id: "dwg-prod-softener-001",
    slug: "metered-water-softener",
    name: "Metered Water Softener",
    categorySlug: "water-softeners",
    summary: "Softening system placeholder for catalog review.",
    status: "PUBLISHED",
    quoteRequired: true
  },
  {
    id: "dwg-prod-ro-001",
    slug: "commercial-ro-system",
    name: "Commercial RO System",
    categorySlug: "ro-systems",
    summary: "Commercial reverse osmosis quote-first placeholder.",
    status: "PUBLISHED",
    quoteRequired: true
  },
  {
    id: "dwg-prod-chloramine-001",
    slug: "chloramine-carbon-system",
    name: "Chloramine Carbon System",
    categorySlug: "chloramine-treatment",
    summary: "Catalytic carbon/chloramine treatment placeholder.",
    status: "PUBLISHED",
    quoteRequired: true
  },
  {
    id: "dwg-prod-filter-001",
    slug: "replacement-filter-cartridge",
    name: "Replacement Filter Cartridge",
    categorySlug: "filters-cartridges",
    summary: "Commodity filter cartridge placeholder.",
    status: "PUBLISHED",
    quoteRequired: false
  }
];
