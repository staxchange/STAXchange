export type UUID = string;

export type ProductStatus = "DRAFT" | "REVIEW" | "APPROVED" | "PUBLISHED" | "QUARANTINED";
export type QuoteStatus = "NEW" | "REVIEWING" | "DRAFTED" | "SENT" | "ACCEPTED" | "DECLINED";
export type OrderStatus = "PENDING" | "PAID" | "FULFILLMENT_REQUESTED" | "FULFILLED" | "CANCELLED";

export interface NavItem {
  label: string;
  href: string;
}

export interface BrandDress {
  id: string;
  name: string;
  legalName: string;
  tagline: string;
  positioning: string;
  description: string;
  domain: string;
  hero: {
    title: string;
    body: string;
  };
  contact: {
    quoteEmail: string;
    phone: string;
    serviceArea: string;
  };
  navigation: NavItem[];
  footer: string;
}

export interface CategoryDTO {
  slug: string;
  name: string;
  summary: string;
}

export interface ProductDTO {
  id: UUID;
  slug: string;
  name: string;
  categorySlug: string;
  summary: string;
  status: ProductStatus;
  quoteRequired: boolean;
}

export interface PriceDTO {
  productId: UUID;
  retailPriceCents: number;
  currency: "USD" | "CAD";
  approved: boolean;
  freshUntil: string;
}

export interface QuoteRequestDTO {
  id: UUID;
  company?: string;
  name: string;
  email: string;
  phone?: string;
  details: string;
  status: QuoteStatus;
  createdAt: string;
}

export interface OrderDTO {
  id: UUID;
  status: OrderStatus;
  createdAt: string;
}

export interface SafeMutationDTO {
  id: UUID;
  workflow: string;
  status: string;
  safe: true;
}
