import type { MaintenancePlanDTO } from "./types";

export function planNeedsRenewalReview(plan: MaintenancePlanDTO, now = new Date()): boolean {
  if (!plan.nextVisitDueAt) return false;
  const due = new Date(plan.nextVisitDueAt).getTime();
  return plan.status === "ACTIVE" && due - now.getTime() <= 30 * 24 * 60 * 60 * 1000;
}
