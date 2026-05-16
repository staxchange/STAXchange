export default async function TechnicianPartsPage({ params }: { params: Promise<{ workOrderId: string }> }) {
  const { workOrderId } = await params;

  return (
    <section>
      <h1>Parts Used</h1>
      <p>Work order: {workOrderId}</p>
      <p>Parts used entries require review before inventory adjustment and invoice draft creation.</p>
    </section>
  );
}
