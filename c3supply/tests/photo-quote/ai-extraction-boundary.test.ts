import { aiExtractionIsFinal, extractionCandidateIsVerified, extractionTextViolatesPolicy } from "@stax/photo-quote-intake";

test("AI extraction is never final", () => {
  expect(aiExtractionIsFinal()).toBe(false);
  expect(extractionCandidateIsVerified()).toBe(false);
});

test("policy flags final quote language", () => {
  expect(extractionTextViolatesPolicy("final quote")).toBe(true);
  expect(extractionTextViolatesPolicy("visible label text")).toBe(false);
});
