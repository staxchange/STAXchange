import { canDispatchNotification, notificationSubject } from "@stax/notifications";

const preference = {
  id: "prefs-1",
  customerId: "customer-1",
  emailEnabled: true,
  serviceUpdatesEnabled: true,
  maintenanceRemindersEnabled: true,
  billingUpdatesEnabled: true
};

test("service notification can dispatch when enabled", () => {
  expect(canDispatchNotification(preference, "SERVICE_REQUEST_RECEIVED")).toBe(true);
});

test("disabled email blocks dispatch", () => {
  expect(canDispatchNotification({ ...preference, emailEnabled: false }, "SERVICE_REQUEST_RECEIVED")).toBe(false);
});

test("template has subject", () => {
  expect(notificationSubject("MAINTENANCE_REMINDER")).toContain("maintenance");
});
