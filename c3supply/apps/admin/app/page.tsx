import { workflowSummaries } from "@stax/workflows";

export default function AdminHome() {
  return (
    <section>
      <h1>DWG Admin Shell</h1>
      <p>Controlled queues for product, pricing, quote, fulfillment, and export workflows.</p>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {workflowSummaries.map((workflow) => (
          <article key={workflow.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18 }}>
            <h2>{workflow.name}</h2>
            <p>{workflow.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
