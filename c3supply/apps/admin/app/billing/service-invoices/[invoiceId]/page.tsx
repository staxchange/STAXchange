export default async function ServiceInvoiceDetailPage({ params }: { params: Promise<{ invoiceId: string }> }) {
  const { invoiceId } = await params;

  return (
    <section>
      <h1>Invoice Review: {invoiceId}</h1>
      <p>
        Finance review placeholder. Approval and rejection must call packages/commands.
        No autonomous billing approval is allowed.
      </p>
    </section>
  );
}
