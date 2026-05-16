import type { AssignedWorkOrderDTO } from "./types";

export function filterAssignedWorkOrders(workOrders: AssignedWorkOrderDTO[], technicianId: string): AssignedWorkOrderDTO[] {
  return workOrders.filter((workOrder) => workOrder.technicianId === technicianId);
}

export function assertAssignedWorkOrder(workOrder: AssignedWorkOrderDTO, technicianId: string): void {
  if (workOrder.technicianId !== technicianId) {
    throw new Error("Technician can only act on assigned work orders.");
  }
}
