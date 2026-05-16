import type { AssignedWorkOrderDTO, ChecklistItemDTO } from "@stax/technician-portal";

export const placeholderWorkOrders: AssignedWorkOrderDTO[] = [
  {
    id: "wo-1001",
    serviceRequestId: "svc-1001",
    technicianId: "tech-demo",
    customerName: "Example Customer",
    siteAddress: "123 Water Street",
    priority: "HIGH",
    status: "ASSIGNED",
    summary: "Inspect leaking filter housing near inlet.",
    scheduledStart: new Date().toISOString()
  },
  {
    id: "wo-1002",
    serviceRequestId: "svc-1002",
    technicianId: "tech-demo",
    customerName: "Maintenance Account",
    priority: "MEDIUM",
    status: "ASSIGNED",
    summary: "Routine filter replacement and system check."
  }
];

export const placeholderChecklist: ChecklistItemDTO[] = [
  { id: "safety-review", workOrderId: "wo-1001", label: "Confirm site safety and shutoff access.", completed: false },
  { id: "system-id", workOrderId: "wo-1001", label: "Confirm system model and serial number.", completed: false },
  { id: "document-findings", workOrderId: "wo-1001", label: "Document field findings and customer-approved next steps.", completed: false }
];
