export default async function PricingReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Pricing review {id}</h1><p>Review supplier cost, currency, freight placeholder, and margin before quote document approval.</p></section>;
}
