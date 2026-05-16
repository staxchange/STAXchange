import { sampleCommerceProducts } from "@stax/product-catalog";
import { C3QuoteFirstBanner } from "../../../components/C3QuoteFirstBanner";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = sampleCommerceProducts.find((item) => item.slug === slug);
  return <main><h1>{product?.name ?? "Product"}</h1><p>{product?.summary ?? "Catalog item pending review."}</p><C3QuoteFirstBanner /><a className="c3-button" href="/quote">Request quote</a></main>;
}
