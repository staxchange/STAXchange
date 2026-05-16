export type MaintenancePlanStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "RENEWAL_REVIEW" | "CANCELLED" | "EXPIRED";

export type MaintenancePlanFrequency = "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "ANNUAL";

export interface MaintenancePlanDTO {
  id: string;
  customerId: string;
  treatmentSystemId?: string;
  status: MaintenancePlanStatus;
  frequency: MaintenancePlanFrequency;
  nextVisitDueAt?: string;
  createdAt: string;
}

export interface MaintenancePlanEventDTO {
  id: string;
  maintenancePlanId: string;
  eventType: "CREATED" | "ACTIVATED" | "VISIT_SCHEDULED" | "RENEWED" | "CANCELLED";
  createdAt: string;
}
