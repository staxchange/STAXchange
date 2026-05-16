import { checklistForCategory, serviceSLAForClassification } from "@stax/service-interface";

const placeholderRequests: Array<{ id: string; customer: string; category: "LEAK" | "FILTER_REPLACEMENT"; severity: "LOW" | "HIGH" | "EMERGENCY"; reason: string }> = [
  {
    id: "svc-placeholder-1",
    customer: "Example Customer",
    category: "LEAK" as const,
    severity: "HIGH" as const,
    reason: "Leak or active water escape requires human service review."
  },
  {
    id: "svc-placeholder-2",
    customer: "Routine Maintenance Account",
    category: "FILTER_REPLACEMENT" as const,
    severity: "LOW" as const,
    reason: "Filter replacement can be routed through standard service intake."
  }
];

export default function AdminServiceQueuePage() {
  return (
    <section>
      <h1>Treatment System Service Queue</h1>
      <p>
        Governed service requests, triage outcomes, emergency flags, work order creation,
        technician assignment, and completion records.
      </p>
      <p>
        Production queue API: <code>/api/service-queue</code>. Requires Supabase Auth profile role OPS, ADMIN, or SUPER_ADMIN.
      </p>

      <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
        {placeholderRequests.map((request) => {
          const sla = serviceSLAForClassification({
            severity: request.severity,
            category: request.category,
            requiresHumanReview: true,
            emergencyEscalation: false,
            reason: request.reason
          });

          return (
            <article
              key={request.id}
              style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18 }}
            >
              <h2>{request.id}</h2>
              <p><strong>Customer:</strong> {request.customer}</p>
              <p><strong>Category:</strong> {request.category}</p>
              <p><strong>Severity:</strong> {request.severity}</p>
              <p><strong>SLA:</strong> {sla.label} / {sla.targetResponseHours}h</p>
              <h3>Checklist</h3>
              <ul>
                {checklistForCategory(request.category).map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
