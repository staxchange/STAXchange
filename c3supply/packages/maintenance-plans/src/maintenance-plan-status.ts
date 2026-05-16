import type { MaintenancePlanStatus } from "./types";

export function canActivateMaintenancePlan(status: MaintenancePlanStatus): boolean {
  return status === "DRAFT" || status === "RENEWAL_REVIEW";
}

export function canCancelMaintenancePlan(status: MaintenancePlanStatus): boolean {
  return status === "ACTIVE" || status === "PAUSED" || status === "RENEWAL_REVIEW";
}
