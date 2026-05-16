import { assertAssignedWorkOrder, filterAssignedWorkOrders, type AssignedWorkOrderDTO } from "@stax/technician-portal";

const workOrders: AssignedWorkOrderDTO[] = [
  { id: "wo-1", serviceRequestId: "svc-1", technicianId: "tech-1", customerName: "A", priority: "LOW", status: "ASSIGNED", summary: "A" },
  { id: "wo-2", serviceRequestId: "svc-2", technicianId: "tech-2", customerName: "B", priority: "HIGH", status: "ASSIGNED", summary: "B" }
];

test("filters work orders by assigned technician", () => {
  expect(filterAssignedWorkOrders(workOrders, "tech-1").map((item) => item.id)).toEqual(["wo-1"]);
});

test("rejects action on unassigned work order", () => {
  expect(() => assertAssignedWorkOrder(workOrders[1], "tech-1")).toThrow("assigned work orders");
});
