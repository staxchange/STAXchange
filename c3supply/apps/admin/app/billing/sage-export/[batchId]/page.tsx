export default async function SageExportBatchDetailPage({ params }: { params: Promise<{ batchId: string }> }) {
  const { batchId } = await params;

  return (
    <section>
      <h1>Simply Accounting Export Batch: {batchId}</h1>
      <p>Review batch contents before marking ready for Simply Accounting export.</p>
    </section>
  );
}
