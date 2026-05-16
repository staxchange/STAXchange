import "./globals.css";

export const metadata = {
  title: "DWG Customer Portal",
  description: "Customer portal for DWG treatment systems, service history, invoices, and maintenance plans."
};

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <strong>DWG Customer Portal</strong>
          <a href="/">Dashboard</a>
          <a href="/systems">Systems</a>
          <a href="/service-history">Service History</a>
          <a href="/invoices">Invoices</a>
          <a href="/maintenance-plans">Maintenance Plans</a>
          <a href="/notifications">Notifications</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
