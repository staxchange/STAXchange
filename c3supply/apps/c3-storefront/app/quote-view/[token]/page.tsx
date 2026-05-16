export default async function C3QuoteViewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main><h1>C3 Supply Co. quote view</h1><p>Token: {token}</p><p>Only approved and sent quotes may be viewed. Acceptance is command-gated.</p></main>;
}
