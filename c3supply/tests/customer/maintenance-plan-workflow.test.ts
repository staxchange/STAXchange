import {
  canActivateMaintenancePlan,
  canCancelMaintenancePlan,
  nextMaintenanceDate,
  planAllowsServiceReminder
} from "@stax/maintenance-plans";

test("maintenance plan can activate from draft", () => {
  expect(canActivateMaintenancePlan("DRAFT")).toBe(true);
});

test("active maintenance plan can be cancelled", () => {
  expect(canCancelMaintenancePlan("ACTIVE")).toBe(true);
});

test("next quarterly maintenance date is generated", () => {
  expect(nextMaintenanceDate("QUARTERLY")).toContain("T");
});

test("active plan with due date allows service reminder", () => {
  expect(
    planAllowsServiceReminder({
      id: "plan-1",
      customerId: "customer-1",
      status: "ACTIVE",
      frequency: "QUARTERLY",
      nextVisitDueAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    })
  ).toBe(true);
});
