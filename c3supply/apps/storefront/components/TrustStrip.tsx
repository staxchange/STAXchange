import { dwgTrustPillars } from "@stax/storefront-conversion";

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="DWG trust indicators">
      {dwgTrustPillars.map((pillar) => (
        <article key={pillar.id}>
          <span />
          <strong>{pillar.label}</strong>
          <p>{pillar.body}</p>
        </article>
      ))}
    </section>
  );
}
