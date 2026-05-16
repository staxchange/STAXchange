import type { WorkflowDefinition } from "../workflow-types";

export const technicianWorkOrderWorkflow: WorkflowDefinition = {
  id: "technician-work-order",
  name: "Technician Work Order",
  description:
    "Assigned field work order workflow with checklist, notes, parts, photos, technician closeout, and manager review.",
  initialStatus: "ASSIGNED",
  terminalStatuses: ["CLOSED", "REJECTED"],
  transitions: [
    { from: "ASSIGNED", to: "IN_PROGRESS", command: "StartTechnicianWorkOrderCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "IN_PROGRESS", to: "CHECKLIST_IN_PROGRESS", command: "CompleteTechnicianChecklistItemCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "CHECKLIST_IN_PROGRESS", to: "FIELD_NOTES_ADDED", command: "AddTechnicianVisitNoteCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "FIELD_NOTES_ADDED", to: "PARTS_RECORDED", command: "AddServicePartUsedCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PARTS_RECORDED", to: "PHOTOS_ATTACHED", command: "AttachServicePhotoCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "PHOTOS_ATTACHED", to: "MANAGER_REVIEW_REQUIRED", command: "SubmitTechnicianCloseoutCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "MANAGER_REVIEW_REQUIRED", to: "APPROVED", command: "ApproveServiceCloseoutCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "APPROVED", to: "CLOSED", command: "CloseWorkOrderCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "MANAGER_REVIEW_REQUIRED", to: "REJECTED", command: "RejectServiceCloseoutCommand", allowedRoles: ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "REJECTED", to: "IN_PROGRESS", command: "StartTechnicianWorkOrderCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "ASSIGNED", to: "HUMAN_TECHNICAL_REVIEW_REQUIRED", command: "RequestHumanTechnicalReviewCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] },
    { from: "IN_PROGRESS", to: "HUMAN_TECHNICAL_REVIEW_REQUIRED", command: "RequestHumanTechnicalReviewCommand", allowedRoles: ["TECHNICIAN", "SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"] }
  ]
};
