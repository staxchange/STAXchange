import type { MaintenanceFollowupDTO } from "./types";

export function createMaintenanceFollowupDTO(input: {
  id: string;
  workOrderId: string;
  reason: string;
  targetDate?: string;
}): MaintenanceFollowupDTO {
  return {
    id: input.id,
    workOrderId: input.workOrderId,
    reason: input.reason,
    targetDate: input.targetDate,
    status: "CREATED",
    createdAt: new Date().toISOString()
  };
}
