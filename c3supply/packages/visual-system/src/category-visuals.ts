import type { CategoryVisualDescriptor } from "./types";

export const categoryVisuals: CategoryVisualDescriptor[] = [
  {
    slug: "iron-removal",
    icon: "iron",
    gaugeLabel: "Staining control",
    accent: "copper"
  },
  {
    slug: "water-softeners",
    icon: "softener",
    gaugeLabel: "Hardness control",
    accent: "brass"
  },
  {
    slug: "ro-systems",
    icon: "ro",
    gaugeLabel: "Membrane flow",
    accent: "patina"
  },
  {
    slug: "chloramine-treatment",
    icon: "chloramine",
    gaugeLabel: "Carbon contact",
    accent: "valve"
  },
  {
    slug: "filters-cartridges",
    icon: "cartridge",
    gaugeLabel: "Replacement parts",
    accent: "brass"
  }
];

export function visualForCategory(slug: string): CategoryVisualDescriptor {
  return (
    categoryVisuals.find((visual) => visual.slug === slug) ?? {
      slug,
      icon: "gauge",
      gaugeLabel: "Controlled catalog",
      accent: "copper"
    }
  );
}
