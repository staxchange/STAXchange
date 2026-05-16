export function C3ProductCard({ name, summary, href }: { name: string; summary: string; href: string }) {
  return <article className="c3-card"><h3>{name}</h3><p>{summary}</p><a href={href}>View →</a></article>;
}
