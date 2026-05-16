import { productCanCheckoutLite, type ProductDTO } from "@stax/product-catalog";
import { HumanReviewRequiredBanner } from "./HumanReviewRequiredBanner";
export function CheckoutLiteGuard({ product, children }: { product: ProductDTO; children: React.ReactNode }) { return productCanCheckoutLite(product) ? <>{children}</> : <HumanReviewRequiredBanner>Checkout-lite is blocked because this item requires quote review.</HumanReviewRequiredBanner>; }
