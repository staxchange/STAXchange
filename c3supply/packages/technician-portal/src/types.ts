export type TechnicianWorkOrderStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "CHECKLIST_IN_PROGRESS"
  | "FIELD_NOTES_ADDED"
  | "PARTS_RECORDED"
  | "PHOTOS_ATTACHED"
  | "CLOSEOUT_SUBMITTED"
  | "MANAGER_REVIEW_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "CLOSED"
  | "HUMAN_TECHNICAL_REVIEW_REQUIRED";

export interface TechnicianSessionDTO {
  id: string;
  technicianId: string;
  actorId: string;
  startedAt: string;
  expiresAt: string;
}

export interface AssignedWorkOrderDTO {
  id: string;
  serviceRequestId: string;
  technicianId: string;
  customerName: string;
  siteAddress?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
  status: TechnicianWorkOrderStatus;
  summary: string;
  scheduledStart?: string;
}

export interface ChecklistItemDTO {
  id: string;
  workOrderId: string;
  label: string;
  completed: boolean;
  completedAt?: string;
}

export interface TechnicianVisitNoteDTO {
  id: string;
  workOrderId: string;
  technicianId: string;
  note: string;
  createdAt: string;
}

export interface ServicePartUsedDTO {
  id: string;
  workOrderId: string;
  sku?: string;
  description: string;
  quantity: number;
  createdAt: string;
}

export interface ServicePhotoDTO {
  id: string;
  workOrderId: string;
  objectPath: string;
  contentType: string;
  uploadedAt: string;
}

export interface TechnicianCloseoutDTO {
  id: string;
  workOrderId: string;
  technicianId: string;
  findings: string;
  actionsTaken: string;
  followUpRequired: boolean;
  status: "MANAGER_REVIEW_REQUIRED";
  submittedAt: string;
}

export interface ManagerReviewDTO {
  id: string;
  closeoutId: string;
  reviewerId: string;
  status: "APPROVED" | "REJECTED";
  reason?: string;
  reviewedAt: string;
}
