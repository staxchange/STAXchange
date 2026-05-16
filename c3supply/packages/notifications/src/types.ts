export type NotificationChannel = "EMAIL" | "TEAMS" | "CRM_WEBHOOK" | "IN_APP";
export type NotificationStatus = "QUEUED" | "SENT" | "FAILED" | "CANCELLED";

export interface NotificationPreferenceDTO {
  id: string;
  customerId?: string;
  emailEnabled: boolean;
  serviceUpdatesEnabled: boolean;
  maintenanceRemindersEnabled: boolean;
  billingUpdatesEnabled: boolean;
}

export interface NotificationQueueItemDTO {
  id: string;
  channel: NotificationChannel;
  templateId: string;
  recipient: string;
  payload: Record<string, unknown>;
  status: NotificationStatus;
  createdAt: string;
}

export interface NotificationDispatchResult {
  ok: boolean;
  channel: NotificationChannel;
  providerMessageId?: string;
  error?: string;
}
