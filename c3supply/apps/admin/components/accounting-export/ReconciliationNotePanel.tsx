export function ReconciliationNotePanel({ batchId }: { batchId: string }) {
  return (
    <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
      <h2>Reconciliation note</h2>
      <p>Record manual Simply Accounting import/review outcome.</p>
      <form action="/api/billing/simply-accounting/reconciliation-note" method="post">
        <input type="hidden" name="batchId" value={batchId} />
        <textarea name="note" placeholder="Reconciliation note" style={{ width: "100%", minHeight: 100 }} />
        <button type="submit">Add note</button>
      </form>
    </section>
  );
}
