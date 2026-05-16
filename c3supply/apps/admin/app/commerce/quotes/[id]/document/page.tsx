export default async function QuoteDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Quote document {id}</h1><p>Generate customer-facing document only after approved commerce quote and human review.</p></section>;
}
