import type { MaintenancePlanFrequency } from "./types";

export function nextMaintenanceDate(frequency: MaintenancePlanFrequency, from = new Date()): string {
  const date = new Date(from);

  if (frequency === "MONTHLY") date.setMonth(date.getMonth() + 1);
  if (frequency === "QUARTERLY") date.setMonth(date.getMonth() + 3);
  if (frequency === "SEMI_ANNUAL") date.setMonth(date.getMonth() + 6);
  if (frequency === "ANNUAL") date.setFullYear(date.getFullYear() + 1);

  return date.toISOString();
}
