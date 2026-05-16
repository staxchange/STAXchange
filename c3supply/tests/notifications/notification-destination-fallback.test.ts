import { createNotificationQueueItem, dispatchToDestination } from "@stax/notifications";

test("missing webhook destination fails safely", async () => {
  const item = createNotificationQueueItem({ id: "n-1", channel: "EMAIL", templateId: "SERVICE_REQUEST_RECEIVED", recipient: "test@example.com", payload: {} });
  const result = await dispatchToDestination(item, { kind: "EMAIL" });
  expect(result.ok).toBe(false);
});
