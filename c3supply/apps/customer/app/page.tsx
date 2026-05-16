export default function CustomerDashboardPage() {
  return (
    <main>
      <h1>Customer Dashboard</h1>
      <p>View linked treatment systems, service history, invoices, maintenance plans, and notification preferences.</p>
      <section className="card">
        <h2>Portal boundary</h2>
        <p>Customer portal views are read-focused. Protected service/billing mutations route through commands.</p>
      </section>
    </main>
  );
}
