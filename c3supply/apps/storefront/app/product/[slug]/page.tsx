import { dwgProducts } from "@stax/brand-dwg";
import { IndustrialBadge } from "../../../components/IndustrialBadge";
import { PipeDivider } from "../../../components/PipeDivider";
import { RivetPanel } from "../../../components/RivetPanel";
import { ProductHeroVisual } from "../../../components/ProductHeroVisual";
import { AddToCartOrQuoteButton } from "../../../components/AddToCartOrQuoteButton";
import { QuoteRequiredBanner } from "../../../components/QuoteRequiredBanner";
import { ProductApprovalBadge } from "../../../components/ProductApprovalBadge";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = dwgProducts.find((item) => item.slug === slug);

  if (!product) {
    return (
      <main className="page">
        <IndustrialBadge>Catalog record</IndustrialBadge>
        <h1>Product not found</h1>
        <p>This catalog item has not been published.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <IndustrialBadge>{product.categorySlug}</IndustrialBadge>
      <h1>{product.name}</h1>
      <ProductApprovalBadge status={product.status} />
      <p>{product.summary}</p>
      <ProductHeroVisual categorySlug={product.categorySlug} title={product.name} />

      <PipeDivider />

      <RivetPanel>
        <h2>Operational mode</h2>
        <p>
          {product.quoteRequired
            ? "Quote-first review required. A human DWG reviewer should confirm fit, application, and availability."
            : "Checkout eligible placeholder. Final checkout wiring remains governed."}
        </p>
        {product.quoteRequired ? <QuoteRequiredBanner /> : null}
        <AddToCartOrQuoteButton product={{ ...product, approvalStatus: product.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT", availability: product.quoteRequired ? "QUOTE_ONLY" : "IN_STOCK", checkoutEligible: !product.quoteRequired }} />
      </RivetPanel>
    </main>
  );
}
