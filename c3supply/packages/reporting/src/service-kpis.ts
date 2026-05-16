import type { ServiceKpiSnapshotDTO } from "./types";

export function createServiceKpiSnapshot(input: Omit<ServiceKpiSnapshotDTO, "id" | "createdAt">): ServiceKpiSnapshotDTO {
  return {
    id: `service-kpi-${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString()
  };
}
