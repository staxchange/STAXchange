export type CustomerPortalSessionStatus = "CREATED" | "ACTIVE" | "EXPIRED" | "REVOKED";

export interface CustomerProfileDTO {
  id: string;
  email: string;
  name?: string;
  company?: string;
  createdAt: string;
}

export interface CustomerPortalSessionDTO {
  id: string;
  customerId: string;
  status: CustomerPortalSessionStatus;
  createdAt: string;
  expiresAt: string;
}

export interface CustomerSystemLinkDTO {
  id: string;
  customerId: string;
  treatmentSystemId: string;
  accessLevel: "VIEW_ONLY" | "SERVICE_REQUEST";
  verified: boolean;
  createdAt: string;
}

export interface CustomerServiceHistoryItemDTO {
  id: string;
  workOrderId: string;
  treatmentSystemId?: string;
  status: string;
  summary: string;
  completedAt?: string;
}

export interface CustomerInvoiceSummaryDTO {
  id: string;
  status: "DRAFT" | "REVIEW_REQUIRED" | "APPROVED" | "BILLING_PACKET_CREATED" | "READY_FOR_SIMPLY_ACCOUNTING_EXPORT";
  subtotalCents: number;
  currency: "CAD" | "USD";
  createdAt: string;
}

export interface CustomerNotificationPreferenceDTO {
  id: string;
  customerId: string;
  emailEnabled: boolean;
  serviceUpdatesEnabled: boolean;
  maintenanceRemindersEnabled: boolean;
  billingUpdatesEnabled: boolean;
}
