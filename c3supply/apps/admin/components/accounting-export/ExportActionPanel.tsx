export function ExportActionPanel({ batchId }: { batchId: string }) {
  return (
    <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
      <h2>Export outcome</h2>
      <p>After manual Simply Accounting review/import, mark the batch exported or failed.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <form action="/api/billing/simply-accounting/mark-exported" method="post">
          <input type="hidden" name="batchId" value={batchId} />
          <button type="submit">Mark exported</button>
        </form>
        <form action="/api/billing/simply-accounting/mark-failed" method="post">
          <input type="hidden" name="batchId" value={batchId} />
          <button type="submit">Mark failed</button>
        </form>
        <form action="/api/billing/simply-accounting/archive-batch" method="post">
          <input type="hidden" name="batchId" value={batchId} />
          <button type="submit">Archive batch</button>
        </form>
      </div>
    </section>
  );
}
