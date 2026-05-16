import type { PartInventoryItemDTO } from "./types";
import { inventoryStatusForItem } from "./inventory-status";

export function stockAlertRequired(item: PartInventoryItemDTO): boolean {
  const status = inventoryStatusForItem(item);
  return status === "LOW_STOCK" || status === "OUT_OF_STOCK";
}
