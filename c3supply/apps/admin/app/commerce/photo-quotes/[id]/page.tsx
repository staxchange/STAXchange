export default async function AdminPhotoQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Photo quote {id}</h1><p>Review photos, notes, and candidates before quote conversion.</p></section>;
}
