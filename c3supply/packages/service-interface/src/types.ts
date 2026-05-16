export type ServiceSeverity = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export type ServiceIssueCategory =
  | "NO_WATER"
  | "LOW_PRESSURE"
  | "LEAK"
  | "FLOOD_RISK"
  | "WATER_QUALITY"
  | "TASTE_ODOR"
  | "IRON_STAINING"
  | "HARDNESS"
  | "CHLORINE_CHLORAMINE"
  | "FILTER_REPLACEMENT"
  | "RO_SYSTEM"
  | "SOFTENER"
  | "CHEMICAL_FEED"
  | "ELECTRICAL"
  | "INSTALLATION"
  | "PREVENTIVE_MAINTENANCE"
  | "UNKNOWN";

export type ServiceRequestStatus =
  | "NEW"
  | "TRIAGED"
  | "HUMAN_REVIEW_REQUIRED"
  | "WORK_ORDER_CREATED"
  | "SCHEDULED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "ESCALATED";

export type TreatmentSystemType =
  | "IRON_REMOVAL"
  | "WATER_SOFTENER"
  | "RO_SYSTEM"
  | "CARBON_FILTER"
  | "CHLORAMINE_TREATMENT"
  | "SEDIMENT_FILTER"
  | "UV_SYSTEM"
  | "CHEMICAL_FEED"
  | "UNKNOWN";

export interface TreatmentSystemDTO {
  id: string;
  brandId: "dwg";
  customerId?: string;
  siteName?: string;
  siteAddress?: string;
  systemType: TreatmentSystemType;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installedAt?: string;
  lastServicedAt?: string;
  nextServiceDueAt?: string;
}

export interface ServiceCustomerDTO {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  siteAddress?: string;
}

export interface ServiceRequestInput {
  customer: ServiceCustomerDTO;
  systemId?: string;
  systemType?: TreatmentSystemType;
  issueDescription: string;
  preferredServiceWindow?: string;
  siteAccessNotes?: string;
  photosProvided?: boolean;
}

export interface ServiceClassification {
  severity: ServiceSeverity;
  category: ServiceIssueCategory;
  requiresHumanReview: boolean;
  emergencyEscalation: boolean;
  reason: string;
}

export interface ServiceRequestDTO {
  id: string;
  brandId: "dwg";
  status: ServiceRequestStatus;
  customer: ServiceCustomerDTO;
  systemId?: string;
  systemType?: TreatmentSystemType;
  issueDescription: string;
  classification: ServiceClassification;
  createdAt: string;
}

export interface ServiceWorkOrderDTO {
  id: string;
  serviceRequestId: string;
  status: "CREATED" | "SCHEDULED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  technicianId?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  createdAt: string;
}

export interface ServiceVisitDTO {
  id: string;
  workOrderId: string;
  technicianId: string;
  startedAt?: string;
  completedAt?: string;
  findings?: string;
  actionsTaken?: string;
  followUpRequired?: boolean;
}

export interface ServiceApiResponse<TData> {
  ok: boolean;
  data?: TData;
  error?: string;
}
