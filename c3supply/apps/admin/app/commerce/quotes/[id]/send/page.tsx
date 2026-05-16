export default async function QuoteSendPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Send quote {id}</h1><p>Create share link after document approval. Manual pricing review required.</p></section>;
}
