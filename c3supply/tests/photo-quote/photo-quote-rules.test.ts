import { humanReviewAlwaysRequired, missingRequiredPhotos, createEquipmentExtractionCandidate } from "@stax/photo-quote-intake";

test("photo quote always requires human review", () => {
  expect(humanReviewAlwaysRequired()).toBe(true);
});

test("overview photo is required", () => {
  expect(missingRequiredPhotos({ photos: [] })).toContain("EQUIPMENT_OVERVIEW");
});

test("AI extraction candidate is unverified and not final", () => {
  const candidate = createEquipmentExtractionCandidate({
    intakeId: "intake-1",
    operatorNotes: "Pump nameplate visible.",
    uploadedPhotoTypes: ["EQUIPMENT_OVERVIEW"]
  });

  expect(candidate.verified).toBe(false);
  expect(candidate.finalQuote).toBe(false);
  expect(candidate.finalPrice).toBe(false);
});
