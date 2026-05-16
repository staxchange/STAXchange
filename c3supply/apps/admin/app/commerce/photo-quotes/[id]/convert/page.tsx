export default async function AdminPhotoQuoteConvertPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Convert {id}</h1><p>Create or link a commerce quote request after human review.</p></section>;
}
