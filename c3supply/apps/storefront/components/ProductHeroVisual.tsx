import { visualForCategory } from "@stax/visual-system";
import { BoilerIcon } from "./icons/BoilerIcon";

export function ProductHeroVisual({
  categorySlug,
  title
}: {
  categorySlug: string;
  title: string;
}) {
  const visual = visualForCategory(categorySlug);

  return (
    <div className={`product-hero-visual product-hero-visual--${visual.accent}`}>
      <BoilerIcon name={visual.icon} label={title} />
      <div className="product-hero-visual__rings" aria-hidden="true" />
    </div>
  );
}
