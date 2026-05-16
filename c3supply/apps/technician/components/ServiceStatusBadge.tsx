export function ServiceStatusBadge({ status }: { status: string }) {
  return <span style={{ border: "1px solid #cbd5e1", borderRadius: 999, padding: "4px 10px", fontWeight: 700 }}>{status}</span>;
}
