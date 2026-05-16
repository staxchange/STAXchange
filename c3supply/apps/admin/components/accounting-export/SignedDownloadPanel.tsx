export function SignedDownloadPanel({ batchId }: { batchId: string }) {
  return (
    <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
      <h2>Signed download</h2>
      <p>Signed downloads require finance approval and are time-limited.</p>
      <form action="/api/billing/simply-accounting/create-signed-download" method="post">
        <input type="hidden" name="batchId" value={batchId} />
        <button type="submit">Create signed download placeholder</button>
      </form>
    </section>
  );
}
