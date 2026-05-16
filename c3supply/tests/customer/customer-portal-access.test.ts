import {
  canCustomerRequestService,
  canCustomerViewSystem,
  customerPortalCanMutateProtectedWorkflow,
  defaultNotificationPreferences
} from "@stax/customer-portal";

test("customer can view verified linked systems", () => {
  expect(
    canCustomerViewSystem({
      id: "link-1",
      customerId: "customer-1",
      treatmentSystemId: "system-1",
      accessLevel: "VIEW_ONLY",
      verified: true,
      createdAt: new Date().toISOString()
    })
  ).toBe(true);
});

test("customer service request requires service access level", () => {
  expect(
    canCustomerRequestService({
      id: "link-1",
      customerId: "customer-1",
      treatmentSystemId: "system-1",
      accessLevel: "VIEW_ONLY",
      verified: true,
      createdAt: new Date().toISOString()
    })
  ).toBe(false);
});

test("customer portal cannot mutate protected workflow directly", () => {
  expect(customerPortalCanMutateProtectedWorkflow()).toBe(false);
});

test("default notification preferences are enabled", () => {
  const prefs = defaultNotificationPreferences({ id: "prefs-1", customerId: "customer-1" });
  expect(prefs.serviceUpdatesEnabled).toBe(true);
});
