import type { WorkflowDefinition } from "../workflow-types";

export const photoQuoteWorkflow: WorkflowDefinition = {
  id: "photo-quote",
  name: "Photo Quote Intake",
  description:
    "Operator photo-based equipment quote intake, optional unverified extraction, human review, and conversion to commerce quote request.",
  initialStatus: "PHOTO_INTAKE_CREATED",
  terminalStatuses: ["QUOTE_SENT", "CLOSED"],
  transitions: [
    { from: "PHOTO_INTAKE_CREATED", to: "PHOTOS_ATTACHED", command: "AttachPhotoQuotePhotoCommand", allowedRoles: ["TECHNICIAN", "OPS", "SALES", "ADMIN", "SUPER_ADMIN"] },
    { from: "PHOTOS_ATTACHED", to: "AI_EXTRACTION_OPTIONAL", command: "RecordEquipmentExtractionCandidateCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PHOTOS_ATTACHED", to: "HUMAN_REVIEW_REQUIRED", command: "RequestPhotoQuoteHumanReviewCommand", allowedRoles: ["TECHNICIAN", "OPS", "SALES", "SERVICE_MANAGER", "ADMIN", "SUPER_ADMIN"] },
    { from: "AI_EXTRACTION_OPTIONAL", to: "HUMAN_REVIEW_REQUIRED", command: "RequestPhotoQuoteHumanReviewCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "HUMAN_REVIEW_REQUIRED", to: "MORE_INFO_REQUIRED", command: "RequestMorePhotoQuoteInfoCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "MORE_INFO_REQUIRED", to: "PHOTOS_ATTACHED", command: "AttachPhotoQuotePhotoCommand", allowedRoles: ["TECHNICIAN", "OPS", "SALES", "ADMIN", "SUPER_ADMIN"] },
    { from: "HUMAN_REVIEW_REQUIRED", to: "QUOTE_REQUEST_CREATED", command: "ConvertPhotoQuoteToCommerceQuoteCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
