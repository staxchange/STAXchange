const nav = [
  { label: "Dashboard", href: "/" },
  { label: "Assigned Work Orders", href: "/work-orders" }
];

export function TechnicianNav() {
  return (
    <aside className="sidebar">
      <h2>DWG Technician</h2>
      {nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
    </aside>
  );
}
