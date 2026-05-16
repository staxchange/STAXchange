import { releaseCandidateChecklist, releaseCandidateReady } from "@stax/e2e-readiness";

test("release checklist contains required gates", () => {
  expect(releaseCandidateChecklist.some((item) => item.id === "audits-pass")).toBe(true);
  expect(releaseCandidateChecklist.some((item) => item.id === "stripe-live-approval")).toBe(true);
});

test("release candidate is not ready until incomplete required gates pass", () => {
  expect(releaseCandidateReady(releaseCandidateChecklist)).toBe(false);
});
