import type { FinanceExportHistoryView } from "@stax/finance-export-ui";

export function ExportHistoryTimeline({ history }: { history: FinanceExportHistoryView[] }) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <h2>Export history</h2>
      {history.map((event) => (
        <article
          key={event.id}
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 16
          }}
        >
          <strong>{event.eventType}</strong>
          <p>Actor: {event.actorId}</p>
          <p>{event.note}</p>
          <small>{event.createdAt}</small>
        </article>
      ))}
    </section>
  );
}
