import {
  createBillingKpiSnapshot,
  createInventoryKpiSnapshot,
  createServiceKpiSnapshot,
  slaBreached,
  slaLabel
} from "@stax/reporting";

test("creates service KPI snapshot", () => {
  const snapshot = createServiceKpiSnapshot({
    openServiceRequests: 2,
    emergencyEscalations: 1,
    completedWorkOrders: 3
  });

  expect(snapshot.openServiceRequests).toBe(2);
});

test("creates billing KPI snapshot", () => {
  expect(createBillingKpiSnapshot({
    invoiceDrafts: 1,
    invoicesApproved: 2,
    sageBatchesReady: 0,
    totalApprovedCents: 1000
  }).totalApprovedCents).toBe(1000);
});

test("creates inventory KPI snapshot", () => {
  expect(createInventoryKpiSnapshot({
    lowStockItems: 1,
    outOfStockItems: 0,
    pendingAdjustments: 2
  }).pendingAdjustments).toBe(2);
});

test("SLA helpers work", () => {
  expect(slaBreached(4, 5)).toBe(true);
  expect(slaLabel(1)).toBe("Emergency");
});
