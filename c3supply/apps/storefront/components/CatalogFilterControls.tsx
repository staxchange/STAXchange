"use client";

import { useMemo, useState } from "react";
import { MobileProductCard } from "./MobileProductCard";

export interface CatalogFilterProduct {
  slug: string;
  name: string;
  summary: string;
  categorySlug: string;
  quoteRequired: boolean;
}

export interface CatalogFilterCategory {
  slug: string;
  name: string;
}

export function CatalogFilterControls({
  products,
  categories
}: {
  products: CatalogFilterProduct[];
  categories: CatalogFilterCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.categorySlug === activeCategory;
      const queryMatch =
        normalized.length === 0 ||
        product.name.toLowerCase().includes(normalized) ||
        product.summary.toLowerCase().includes(normalized);

      return categoryMatch && queryMatch;
    });
  }, [activeCategory, products, query]);

  return (
    <section className="catalog-filter">
      <div className="catalog-filter__controls">
        <input
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search boiler-room catalog..."
        />
        <select
          className="input"
          value={activeCategory}
          onChange={(event) => setActiveCategory(event.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="catalog-filter__results">
        {filteredProducts.map((product) => (
          <MobileProductCard
            key={product.slug}
            name={product.name}
            summary={product.summary}
            quoteRequired={product.quoteRequired}
            href={`/product/${product.slug}`}
          />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p>No matching catalog records. Request a quote and DWG can review the need manually.</p>
      ) : null}
    </section>
  );
}
