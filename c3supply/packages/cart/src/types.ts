export type CartIntentStatus = "ACTIVE" | "QUOTE_REQUIRED" | "CHECKOUT_LITE_ELIGIBLE" | "CONVERTED_TO_QUOTE" | "CLEARED";
export interface CartItemDTO { id: string; cartId: string; productId: string; productSlug?: string; name: string; quantity: number; quoteRequired: boolean; checkoutEligible: boolean; unitPriceCents?: number; currency?: "CAD" | "USD"; }
export interface CartDTO { id: string; status: CartIntentStatus; customerEmail?: string; items: CartItemDTO[]; createdAt: string; updatedAt: string; }
