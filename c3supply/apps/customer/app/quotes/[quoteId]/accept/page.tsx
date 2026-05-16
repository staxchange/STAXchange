export default async function AcceptQuotePage({ params }: { params: Promise<{ quoteId: string }> }) {
  const { quoteId } = await params;
  return <main><h1>Accept quote {quoteId}</h1><p>Accept terms to create an acceptance event. Order creation remains command-gated.</p></main>;
}
