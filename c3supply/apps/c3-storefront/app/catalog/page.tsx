import { sampleCommerceProducts } from "@stax/product-catalog";
import { C3ProductCard } from "../../components/C3ProductCard";
import { C3QuoteFirstBanner } from "../../components/C3QuoteFirstBanner";

export default function CatalogPage() {
  return <main><h1>C3 Supply Co. Catalog</h1><C3QuoteFirstBanner /><div className="c3-grid">{sampleCommerceProducts.map((p) => <C3ProductCard key={p.slug} name={p.name} summary={p.summary} href={`/product/${p.slug}`} />)}</div></main>;
}
