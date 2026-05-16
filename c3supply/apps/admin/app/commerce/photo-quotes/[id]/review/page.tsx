export default async function AdminPhotoQuoteReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Human review {id}</h1><p>AI extraction is optional and not final.</p></section>;
}
