import { signNotificationPayload } from "@stax/notifications";

test("notification payload signing is deterministic", () => {
  const a = signNotificationPayload("payload", "secret");
  const b = signNotificationPayload("payload", "secret");
  expect(a).toBe(b);
  expect(a).toBeDefined();
});

test("notification payload signing returns undefined without secret", () => {
  expect(signNotificationPayload("payload")).toBeUndefined();
});
