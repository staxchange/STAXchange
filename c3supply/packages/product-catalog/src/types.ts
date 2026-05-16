export type ProductApprovalStatus = "DRAFT" | "REVIEW_REQUIRED" | "APPROVED" | "PUBLISHED" | "QUARANTINED";
export type ProductAvailabilityStatus = "IN_STOCK" | "SPECIAL_ORDER" | "QUOTE_ONLY" | "UNAVAILABLE";
export type QuoteRequiredFlag = "QUOTE_REQUIRED" | "CHECKOUT_ELIGIBLE";

export interface ProductCategoryDTO { id: string; slug: string; name: string; summary: string; active: boolean; }
export interface ProductMediaDTO { id: string; productId: string; kind: "IMAGE" | "DOCUMENT"; url: string; alt: string; approved: boolean; }
export interface ProductVariantDTO { id: string; productId: string; sku?: string; name: string; availability: ProductAvailabilityStatus; quoteRequired: boolean; checkoutEligible: boolean; }
export interface ProductDTO {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  summary: string;
  approvalStatus: ProductApprovalStatus;
  availability: ProductAvailabilityStatus;
  quoteRequired: boolean;
  checkoutEligible: boolean;
  variants?: ProductVariantDTO[];
  media?: ProductMediaDTO[];
}
