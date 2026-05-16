export default async function CustomerQuotePage({ params }: { params: Promise<{ quoteId: string }> }) {
  const { quoteId } = await params;
  return <main><h1>Quote {quoteId}</h1><p>Approved quote view. Price and scope cannot be edited here.</p></main>;
}
