export default function ServiceInvoicesPage() {
  const invoices = [
    { id: "inv-placeholder-1", status: "REVIEW_REQUIRED", workOrderId: "wo-1001", subtotal: "$0.00 CAD" },
    { id: "inv-placeholder-2", status: "DRAFT", workOrderId: "wo-1002", subtotal: "$0.00 CAD" }
  ];

  return (
    <section>
      <h1>Service Invoice Drafts</h1>
      <p>Invoices require finance review before billing packet or Simply Accounting export prep.</p>
      {invoices.map((invoice) => (
        <article key={invoice.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18, marginTop: 12 }}>
          <h2>{invoice.id}</h2>
          <p>Status: {invoice.status}</p>
          <p>Work order: {invoice.workOrderId}</p>
          <p>Subtotal: {invoice.subtotal}</p>
          <a href={`/billing/service-invoices/${invoice.id}`}>Review invoice →</a>
        </article>
      ))}
    </section>
  );
}
