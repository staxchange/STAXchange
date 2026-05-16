import type { BillingKpiSnapshotDTO } from "./types";

export function createBillingKpiSnapshot(input: Omit<BillingKpiSnapshotDTO, "id" | "createdAt">): BillingKpiSnapshotDTO {
  return {
    id: `billing-kpi-${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString()
  };
}
