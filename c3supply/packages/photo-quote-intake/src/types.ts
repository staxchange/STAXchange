export type EquipmentPhotoType =
  | "EQUIPMENT_OVERVIEW"
  | "NAMEPLATE"
  | "SERIAL_MODEL_TAG"
  | "CONTROL_PANEL"
  | "PIPING_CONTEXT"
  | "PROBLEM_AREA"
  | "OTHER";

export type PhotoQuoteStatus =
  | "PHOTO_INTAKE_CREATED"
  | "PHOTOS_ATTACHED"
  | "AI_EXTRACTION_OPTIONAL"
  | "HUMAN_REVIEW_REQUIRED"
  | "MORE_INFO_REQUIRED"
  | "QUOTE_REQUEST_CREATED"
  | "QUOTE_DRAFTED"
  | "QUOTE_APPROVED"
  | "QUOTE_SENT"
  | "CLOSED";

export type PhotoQuotePriority = "LOW" | "STANDARD" | "HIGH" | "URGENT";

export type HumanReviewRequiredReason =
  | "PHOTO_QUOTE_ALWAYS_REQUIRES_HUMAN_REVIEW"
  | "MISSING_OVERVIEW_PHOTO"
  | "MISSING_OPERATOR_NOTES"
  | "MISSING_SITE_INFO"
  | "MISSING_CUSTOMER_INFO"
  | "AI_EXTRACTION_UNVERIFIED"
  | "QUOTE_CONVERSION_REQUESTED";

export interface PhotoQuotePhotoDTO {
  id: string;
  intakeId: string;
  photoType: EquipmentPhotoType;
  storageBucket: string;
  storagePath: string;
  uploadedBy: string;
  createdAt: string;
}

export interface EquipmentExtractionCandidate {
  id: string;
  intakeId: string;
  visibleText?: string;
  modelCandidate?: string;
  serialCandidate?: string;
  equipmentCategoryCandidate?: string;
  missingPhotoChecklist: EquipmentPhotoType[];
  humanReviewSummary: string;
  verified: false;
  finalQuote: false;
  finalPrice: false;
  createdAt: string;
}

export interface PhotoQuoteIntakeDTO {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  siteName: string;
  siteLocation?: string;
  operatorId: string;
  priority: PhotoQuotePriority;
  status: PhotoQuoteStatus;
  notes: string;
  photos: PhotoQuotePhotoDTO[];
  humanReviewRequired: true;
  createdAt: string;
  updatedAt: string;
}
