export default async function PublicQuoteViewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className="page"><h1>Quote view</h1><p>Token: {token}</p><p>Only approved and sent quotes may be viewed. Acceptance is command-gated.</p></main>;
}
