export default function BillingDashboardPage() {
  const cards = [
    ["Service invoice drafts", "/billing/service-invoices"],
    ["Labor review", "/billing/labor-review"],
    ["Parts inventory", "/billing/parts-inventory"],
    ["Simply Accounting export batches", "/billing/sage-export"],
    ["Maintenance follow-ups", "/billing/maintenance-followups"]
  ];

  return (
    <section>
      <h1>Service Billing Dashboard</h1>
      <p>
        Finance-reviewed service invoice drafts, billing packets, inventory adjustments,
        and Simply Accounting export preparation.
      </p>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {cards.map(([label, href]) => (
          <article key={href} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18 }}>
            <h2>{label}</h2>
            <a href={href}>Open queue →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
