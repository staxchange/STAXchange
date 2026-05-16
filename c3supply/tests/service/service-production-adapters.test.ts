import {
  checkInMemoryRateLimit,
  createMultiDestinationServiceNotifier,
  resetInMemoryRateLimitForTests,
  validateServiceUploadRequest
} from "@stax/service-interface";

test("rate limiter blocks requests over the configured max", () => {
  resetInMemoryRateLimitForTests();

  expect(checkInMemoryRateLimit("k", { max: 2, windowMs: 1000, now: 1 }).allowed).toBe(true);
  expect(checkInMemoryRateLimit("k", { max: 2, windowMs: 1000, now: 2 }).allowed).toBe(true);
  expect(checkInMemoryRateLimit("k", { max: 2, windowMs: 1000, now: 3 }).allowed).toBe(false);
});

test("service upload validation rejects unsupported content types", () => {
  expect(() =>
    validateServiceUploadRequest({
      bucket: "service-uploads",
      serviceRequestId: "svc-1",
      fileName: "script.js",
      contentType: "application/javascript",
      purpose: "service-photo"
    })
  ).toThrow("Unsupported upload content type.");
});

test("multi-destination notifier returns undelivered when no destinations configured", async () => {
  const notifier = createMultiDestinationServiceNotifier({});

  const result = await notifier.notifyEmergencyEscalation({
    serviceRequestId: "svc-1",
    reason: "Flooding"
  });

  expect(result.delivered).toBe(false);
});
