import { quoteFunnelSteps, serviceFunnelSteps } from "@stax/storefront-conversion";

export function QuoteFunnelCards({ mode = "quote" }: { mode?: "quote" | "service" }) {
  const steps = mode === "quote" ? quoteFunnelSteps : serviceFunnelSteps;

  return (
    <section className="funnel-cards" aria-label={`${mode} funnel`}>
      {steps.map((step) => (
        <article key={step.id} className="funnel-card">
          <p className="kicker">{step.label}</p>
          <p>{step.body}</p>
          {step.href ? <a href={step.href}>Open workflow →</a> : null}
        </article>
      ))}
    </section>
  );
}
