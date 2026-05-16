import type { AssignedWorkOrderDTO } from "@stax/technician-portal";
import { ServiceStatusBadge } from "./ServiceStatusBadge";

export function WorkOrderCard({ workOrder }: { workOrder: AssignedWorkOrderDTO }) {
  return (
    <article className="card">
      <h2>{workOrder.id}</h2>
      <p>{workOrder.summary}</p>
      <p><strong>Customer:</strong> {workOrder.customerName}</p>
      <p><strong>Priority:</strong> {workOrder.priority}</p>
      <ServiceStatusBadge status={workOrder.status} />
      <p><a href={`/work-orders/${workOrder.id}`}>Open work order →</a></p>
    </article>
  );
}
