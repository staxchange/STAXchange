export default async function QuoteRevisionPage({ params }: { params: Promise<{ quoteId: string }> }) {
  const { quoteId } = await params;
  return <main><h1>Request revision {quoteId}</h1><p>Request changes without editing price or scope directly.</p></main>;
}
