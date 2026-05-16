import type { InventoryStatus, PartInventoryItemDTO } from "./types";

export function inventoryStatusForItem(item: PartInventoryItemDTO): InventoryStatus {
  if (item.quantityOnHand <= 0) return "OUT_OF_STOCK";
  if (item.reorderPoint !== undefined && item.quantityOnHand <= item.reorderPoint) return "LOW_STOCK";
  return "IN_STOCK";
}
