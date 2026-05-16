import type { EquipmentExtractionCandidate, EquipmentPhotoType } from "./types";
import { recommendedPhotoChecklist } from "./photo-requirements";

export interface AiExtractionBoundaryInput {
  intakeId: string;
  visibleText?: string;
  operatorNotes: string;
  uploadedPhotoTypes: EquipmentPhotoType[];
}

export function createEquipmentExtractionCandidate(
  input: AiExtractionBoundaryInput
): EquipmentExtractionCandidate {
  const missingPhotoChecklist = recommendedPhotoChecklist({
    photos: input.uploadedPhotoTypes.map((photoType, index) => ({
      id: `photo-${index}`,
      intakeId: input.intakeId,
      photoType,
      storageBucket: "service-attachments",
      storagePath: "placeholder",
      uploadedBy: "operator",
      createdAt: new Date().toISOString()
    }))
  });

  return {
    id: crypto.randomUUID(),
    intakeId: input.intakeId,
    visibleText: input.visibleText,
    modelCandidate: undefined,
    serialCandidate: undefined,
    equipmentCategoryCandidate: undefined,
    missingPhotoChecklist,
    humanReviewSummary: [
      "AI extraction is optional and unverified.",
      "Review visible label text and operator notes before quote creation.",
      input.operatorNotes
    ].join(" "),
    verified: false,
    finalQuote: false,
    finalPrice: false,
    createdAt: new Date().toISOString()
  };
}
