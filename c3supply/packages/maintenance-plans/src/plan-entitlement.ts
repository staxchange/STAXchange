import type { MaintenancePlanDTO } from "./types";

export function planAllowsServiceReminder(plan: MaintenancePlanDTO): boolean {
  return plan.status === "ACTIVE" && Boolean(plan.nextVisitDueAt);
}
