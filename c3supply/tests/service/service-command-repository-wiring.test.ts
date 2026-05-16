import {
  AssignServiceTechnicianCommand,
  CompleteServiceVisitCommand,
  CreateServiceRequestCommand,
  CreateServiceWorkOrderCommand,
  ScheduleServiceVisitCommand,
  TriageServiceRequestCommand
} from "@stax/commands";
import { createInMemoryServiceRepository } from "@stax/service-interface";

const repository = createInMemoryServiceRepository();

const publicContext = {
  actor: { id: "public-test", role: "PUBLIC" as const },
  requestId: "test-request-public",
  repositories: { service: repository }
};

const opsContext = {
  actor: { id: "ops-test", role: "OPS" as const },
  requestId: "test-request-ops",
  repositories: { service: repository }
};

test("service commands write through repository adapter when supplied", async () => {
  const create = await new CreateServiceRequestCommand().run(
    {
      customerName: "Repository Test",
      customerEmail: "repo@example.com",
      issueDescription: "The filter housing is leaking near the inlet.",
      severity: "HIGH",
      category: "LEAK",
      emergencyEscalation: false
    },
    publicContext
  );

  expect(create.ok).toBe(true);
  expect(create.data?.id).toBeTruthy();

  const serviceRequestId = create.data?.id ?? "";

  await new TriageServiceRequestCommand().run(
    {
      serviceRequestId,
      severity: "HIGH",
      category: "LEAK",
      reason: "Leak requires human service review."
    },
    opsContext
  );

  const requests = await repository.listServiceRequests();
  expect(requests.some((request) => request.id === serviceRequestId && request.status === "TRIAGED")).toBe(true);

  const workOrder = await new CreateServiceWorkOrderCommand().run(
    {
      serviceRequestId,
      priority: "HIGH",
      summary: "Inspect leaking filter housing."
    },
    opsContext
  );

  expect(workOrder.ok).toBe(true);
  const workOrderId = workOrder.data?.id ?? "";

  await new ScheduleServiceVisitCommand().run(
    {
      workOrderId,
      scheduledStart: new Date().toISOString()
    },
    opsContext
  );

  await new AssignServiceTechnicianCommand().run(
    {
      workOrderId,
      technicianId: "tech-001"
    },
    opsContext
  );

  await new CompleteServiceVisitCommand().run(
    {
      workOrderId,
      technicianId: "tech-001",
      findings: "Leak source documented by technician.",
      actionsTaken: "Technician actions recorded for human review.",
      followUpRequired: true
    },
    opsContext
  );

  const workOrders = await repository.listWorkOrders();
  expect(workOrders.some((item) => item.id === workOrderId && item.status === "COMPLETED")).toBe(true);
});
