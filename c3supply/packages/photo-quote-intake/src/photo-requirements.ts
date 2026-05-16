import type { EquipmentPhotoType, PhotoQuoteIntakeDTO } from "./types";

export const requiredPhotoTypes: EquipmentPhotoType[] = ["EQUIPMENT_OVERVIEW"];
export const stronglyRecommendedPhotoTypes: EquipmentPhotoType[] = ["NAMEPLATE", "SERIAL_MODEL_TAG"];

export function missingRequiredPhotos(intake: Pick<PhotoQuoteIntakeDTO, "photos">): EquipmentPhotoType[] {
  const uploaded = new Set(intake.photos.map((photo) => photo.photoType));
  return requiredPhotoTypes.filter((type) => !uploaded.has(type));
}

export function hasOverviewPhoto(intake: Pick<PhotoQuoteIntakeDTO, "photos">): boolean {
  return missingRequiredPhotos(intake).length === 0;
}

export function recommendedPhotoChecklist(intake: Pick<PhotoQuoteIntakeDTO, "photos">): EquipmentPhotoType[] {
  const uploaded = new Set(intake.photos.map((photo) => photo.photoType));
  return stronglyRecommendedPhotoTypes.filter((type) => !uploaded.has(type));
}
