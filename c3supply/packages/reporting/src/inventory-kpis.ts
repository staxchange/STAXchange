import type { InventoryKpiSnapshotDTO } from "./types";

export function createInventoryKpiSnapshot(input: Omit<InventoryKpiSnapshotDTO, "id" | "createdAt">): InventoryKpiSnapshotDTO {
  return {
    id: `inventory-kpi-${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString()
  };
}
