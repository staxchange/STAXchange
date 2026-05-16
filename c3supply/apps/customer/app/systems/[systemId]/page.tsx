export default async function TreatmentSystemDetailPage({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params;

  return (
    <main>
      <h1>Treatment System Detail {systemId}</h1>
      <p>System profile, documents, service history, and request-service link.</p>
    </main>
  );
}
