export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section>
      <h1>Commerce Order Detail</h1>
      <p>ID: {id}</p>
      <p>Order draft and billing readiness placeholder.</p>
    </section>
  );
}
