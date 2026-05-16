import type { AssignedWorkOrderDTO } from "@stax/technician-portal";
import { ServiceStatusBadge } from "./ServiceStatusBadge";

export function WorkOrderDetailCard({ workOrder }: { workOrder: AssignedWorkOrderDTO }) {
  return (
    <article className="card">
      <h2>{workOrder.id}</h2>
      <ServiceStatusBadge status={workOrder.status} />
      <p>{workOrder.summary}</p>
      <p><strong>Customer:</strong> {workOrder.customerName}</p>
      <p><strong>Site:</strong> {workOrder.siteAddress ?? "Site address pending"}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href={`/work-orders/${workOrder.id}/checklist`}>Checklist</a>
        <a href={`/work-orders/${workOrder.id}/notes`}>Notes</a>
        <a href={`/work-orders/${workOrder.id}/parts`}>Parts</a>
        <a href={`/work-orders/${workOrder.id}/photos`}>Photos</a>
        <a href={`/work-orders/${workOrder.id}/closeout`}>Closeout</a>
      </div>
    </article>
  );
}
