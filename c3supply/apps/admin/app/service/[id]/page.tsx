export default async function ServiceRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section>
      <h1>Service Request {id}</h1>
      <p>
        Detail placeholder for service request triage, work order creation, scheduling,
        assignment, technician notes, and completion.
      </p>
    </section>
  );
}
