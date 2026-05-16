export default async function PaymentRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Payment request {id}</h1><p>Review payment amount, deposit, and provider status. No supplier costs shown publicly.</p></section>;
}
