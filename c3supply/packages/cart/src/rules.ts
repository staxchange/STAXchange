import type { CartDTO, CartItemDTO } from "./types";

export function validateCartItem(item: CartItemDTO): string[] {
  const errors: string[] = [];
  if (!item.productId) errors.push("productId is required");
  if (!item.name) errors.push("name is required");
  if (!Number.isFinite(item.quantity) || item.quantity <= 0) errors.push("quantity must be positive");
  if (item.quoteRequired && item.checkoutEligible) errors.push("quoteRequired item cannot be checkoutEligible");
  return errors;
}

export function cartRequiresQuote(cart: Pick<CartDTO, "items">): boolean {
  return cart.items.some((item) => item.quoteRequired || !item.checkoutEligible);
}

export function cartCanCheckoutLite(cart: Pick<CartDTO, "items">): boolean {
  return cart.items.length > 0 && !cartRequiresQuote(cart);
}

export function cartSubtotalCents(cart: Pick<CartDTO, "items">): number {
  return cart.items.reduce((total, item) => total + (item.unitPriceCents ?? 0) * item.quantity, 0);
}

export function deriveCartIntentStatus(cart: Pick<CartDTO, "items">): "QUOTE_REQUIRED" | "CHECKOUT_LITE_ELIGIBLE" | "ACTIVE" {
  if (!cart.items.length) return "ACTIVE";
  return cartRequiresQuote(cart) ? "QUOTE_REQUIRED" : "CHECKOUT_LITE_ELIGIBLE";
}
