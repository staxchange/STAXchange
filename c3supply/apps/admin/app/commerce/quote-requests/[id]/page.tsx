export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <section>
      <h1>Commerce Quote Request Detail</h1>
      <p>ID: {id}</p>
      <p>Human review required before quote approval.</p>
    </section>
  );
}
