import type { NotificationPreferenceDTO } from "./types";
import type { NotificationTemplateId } from "./templates";

export function canDispatchNotification(
  preference: NotificationPreferenceDTO,
  templateId: NotificationTemplateId
): boolean {
  if (!preference.emailEnabled) return false;
  if (templateId.includes("SERVICE") && !preference.serviceUpdatesEnabled) return false;
  if (templateId === "MAINTENANCE_REMINDER" && !preference.maintenanceRemindersEnabled) return false;
  if (templateId === "INVOICE_APPROVED" && !preference.billingUpdatesEnabled) return false;
  return true;
}
