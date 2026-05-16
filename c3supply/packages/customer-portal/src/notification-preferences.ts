import type { CustomerNotificationPreferenceDTO } from "./types";

export function defaultNotificationPreferences(input: {
  id: string;
  customerId: string;
}): CustomerNotificationPreferenceDTO {
  return {
    id: input.id,
    customerId: input.customerId,
    emailEnabled: true,
    serviceUpdatesEnabled: true,
    maintenanceRemindersEnabled: true,
    billingUpdatesEnabled: true
  };
}
