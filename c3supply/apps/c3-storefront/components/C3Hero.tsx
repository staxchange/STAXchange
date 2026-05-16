import { c3Brand } from "@stax/c3-supply";

export function C3Hero() {
  return (
    <section className="c3-hero">
      <p>{c3Brand.home.eyebrow}</p>
      <h1>{c3Brand.home.title}</h1>
      <p>{c3Brand.home.subtitle}</p>
      <a className="c3-button" href="/quote">{c3Brand.home.primaryCta}</a>
      <a className="c3-button" href="/catalog">{c3Brand.home.secondaryCta}</a>
    </section>
  );
}
