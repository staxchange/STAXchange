import { sampleCommerceProducts, productCanCheckoutLite, type ProductDTO } from "@stax/product-catalog";
import { CheckoutLiteGuard } from "../../components/CheckoutLiteGuard";

export default function CheckoutLitePage() {
  const product: ProductDTO =
    sampleCommerceProducts.find((item) => productCanCheckoutLite(item)) ??
    sampleCommerceProducts[0] ??
    {
      id: "placeholder",
      slug: "placeholder",
      name: "Placeholder commodity item",
      categorySlug: "filters-cartridges",
      summary: "Placeholder commodity item for checkout-lite guard.",
      approvalStatus: "PUBLISHED",
      availability: "IN_STOCK",
      quoteRequired: false,
      checkoutEligible: true
    };

  return (
    <main className="page">
      <p className="kicker">Checkout-lite</p>
      <h1>Checkout-lite guard</h1>
      <p>Only explicitly checkout-eligible commodity items can proceed. Treatment systems remain quote-first.</p>
      <CheckoutLiteGuard product={product}>
        <section className="rivet-panel">
          <p>This commodity placeholder is eligible for checkout-lite review.</p>
        </section>
      </CheckoutLiteGuard>
    </main>
  );
}
