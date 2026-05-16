export default async function TechnicianLaborPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;

  return (
    <section>
      <h1>Labor Entry</h1>
      <p>Work order: {workOrderId}</p>
      <p>Labor entries are submitted for manager/finance review before invoicing.</p>
    </section>
  );
}
