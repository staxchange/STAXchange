import { createWebhookServiceNotifier } from "@stax/service-interface";

test("service notifier safely reports missing webhook configuration", async () => {
  const notifier = createWebhookServiceNotifier(undefined);

  const result = await notifier.notifyEmergencyEscalation({
    serviceRequestId: "svc-test",
    reason: "Emergency test."
  });

  expect(result.delivered).toBe(false);
  expect(result.error).toContain("not configured");
});
