import type { AssignedWorkOrderDTO } from "@stax/technician-portal";
import { WorkOrderCard } from "./WorkOrderCard";

export function WorkOrderList({ workOrders }: { workOrders: AssignedWorkOrderDTO[] }) {
  return <div className="grid">{workOrders.map((workOrder) => <WorkOrderCard key={workOrder.id} workOrder={workOrder} />)}</div>;
}
