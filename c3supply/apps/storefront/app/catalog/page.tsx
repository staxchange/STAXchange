import { createPageMetadata } from "../metadata";

export const metadata = createPageMetadata({ title: "DWG Catalog", description: "Boiler-room themed water treatment catalog for quote-first systems, service parts, filters, and cartridges.", path: "/catalog" });

import { CatalogFilterControls } from "../../components/CatalogFilterControls";
import type { CSSProperties } from "react";
import { dwgFeaturedCategories, dwgProducts } from "@stax/brand-dwg";
import { IndustrialBadge } from "../../components/IndustrialBadge";
import { PipeDivider } from "../../components/PipeDivider";
import { PressureGaugeCard } from "../../components/PressureGaugeCard";
import { CategoryIllustration } from "../../components/CategoryIllustration";
import { RivetPanel } from "../../components/RivetPanel";

export default function CatalogPage() {
  return (
    <main className="page">
      <IndustrialBadge>Controlled catalog</IndustrialBadge>
      <h1>DWG Process Supply catalog</h1>
      <p>
        Products shown here are governed storefront records. System equipment remains quote-first
        and subject to human review.
      </p>

      <PipeDivider />

      <CatalogFilterControls products={dwgProducts} categories={dwgFeaturedCategories} />

      <PipeDivider />

      {dwgFeaturedCategories.map((category) => (
        <RivetPanel id={category.slug} key={category.slug} style={{ marginTop: 24 } as CSSProperties}>
          <h2>{category.name}</h2>
          <CategoryIllustration slug={category.slug} title={category.name} summary={category.summary} />
          <div className="grid" style={{ marginTop: 18 }}>
            {dwgProducts
              .filter((product) => product.categorySlug === category.slug)
              .map((product) => (
                <PressureGaugeCard
                  key={product.slug}
                  label={product.quoteRequired ? "Quote required" : "Checkout eligible"}
                  value={product.name}
                  detail={product.summary}
                  href={`/product/${product.slug}`}
                />
              ))}
          </div>
        </RivetPanel>
      ))}
    </main>
  );
}
