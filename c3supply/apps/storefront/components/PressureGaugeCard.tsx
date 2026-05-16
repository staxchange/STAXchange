export function PressureGaugeCard({
  label,
  value,
  detail,
  href
}: {
  label: string;
  value: string;
  detail: string;
  href?: string;
}) {
  const content = (
    <article className="pressure-card">
      <div className="pressure-card__gauge" aria-hidden="true">
        <span />
      </div>
      <div>
        <p className="pressure-card__label">{label}</p>
        <h3>{value}</h3>
        <p>{detail}</p>
      </div>
    </article>
  );

  if (!href) return content;

  return (
    <a className="pressure-card-link" href={href}>
      {content}
    </a>
  );
}
