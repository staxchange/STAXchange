import { productCanCheckoutLite, type ProductDTO } from "@stax/product-catalog";
export function AddToCartOrQuoteButton({ product }: { product: ProductDTO }) { const canCheckout = productCanCheckoutLite(product); return <a className="button" href={canCheckout ? "/cart" : `/quote?product=${product.slug}`}>{canCheckout ? "Add to cart intent" : "Request quote"}</a>; }
