export function MobileProductCard({
  name,
  summary,
  href,
  quoteRequired
}: {
  name: string;
  summary: string;
  href: string;
  quoteRequired: boolean;
}) {
  return (
    <article className="mobile-product-card">
      <p className="kicker">{quoteRequired ? "Quote required" : "Checkout eligible"}</p>
      <h3>{name}</h3>
      <p>{summary}</p>
      <a href={href}>View product →</a>
    </article>
  );
}
