import { visualForCategory } from "@stax/visual-system";
import { BoilerIcon } from "./icons/BoilerIcon";

export function CategoryIllustration({
  slug,
  title,
  summary
}: {
  slug: string;
  title: string;
  summary: string;
}) {
  const visual = visualForCategory(slug);

  return (
    <article className={`category-illustration category-illustration--${visual.accent}`}>
      <div className="category-illustration__icon">
        <BoilerIcon name={visual.icon} label={title} />
      </div>
      <div>
        <p className="kicker">{visual.gaugeLabel}</p>
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
    </article>
  );
}
