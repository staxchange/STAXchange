import type { ProductDTO, ProductVariantDTO, QuoteRequiredFlag } from "./types";

export function quoteRequiredFlag(product: Pick<ProductDTO, "quoteRequired" | "checkoutEligible">): QuoteRequiredFlag {
  return product.quoteRequired || !product.checkoutEligible ? "QUOTE_REQUIRED" : "CHECKOUT_ELIGIBLE";
}

export function productRequiresQuote(product: Pick<ProductDTO, "quoteRequired" | "checkoutEligible" | "availability">): boolean {
  return product.quoteRequired || !product.checkoutEligible || product.availability === "QUOTE_ONLY" || product.availability === "SPECIAL_ORDER";
}

export function productCanCheckoutLite(product: Pick<ProductDTO, "quoteRequired" | "checkoutEligible" | "availability" | "approvalStatus">): boolean {
  return product.approvalStatus === "PUBLISHED" && !productRequiresQuote(product);
}

export function variantCanCheckoutLite(variant: ProductVariantDTO): boolean {
  return variant.checkoutEligible && !variant.quoteRequired && variant.availability === "IN_STOCK";
}

export function validateProductForCatalog(product: ProductDTO): string[] {
  const errors: string[] = [];
  if (!product.id) errors.push("id is required");
  if (!product.slug) errors.push("slug is required");
  if (!product.name) errors.push("name is required");
  if (!product.categorySlug) errors.push("categorySlug is required");
  if (!product.summary) errors.push("summary is required");
  if (product.quoteRequired && product.checkoutEligible) errors.push("quoteRequired products cannot be checkoutEligible");
  return errors;
}
