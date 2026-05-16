export function FinanceApprovalPanel({ batchId }: { batchId: string }) {
  return (
    <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
      <h2>Finance approval</h2>
      <p>Approve or reject the export download after reviewing invoice and billing packet context.</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <form action="/api/billing/simply-accounting/approve-download" method="post">
          <input type="hidden" name="batchId" value={batchId} />
          <button type="submit">Approve download</button>
        </form>
        <form action="/api/billing/simply-accounting/reject-download" method="post">
          <input type="hidden" name="batchId" value={batchId} />
          <input type="hidden" name="reason" value="Rejected during finance review." />
          <button type="submit">Reject download</button>
        </form>
      </div>
    </section>
  );
}
