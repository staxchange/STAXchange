export type InventoryAdjustmentReason =
  | "SERVICE_PART_USED"
  | "CORRECTION"
  | "DAMAGE"
  | "RETURN_TO_STOCK"
  | "MANUAL_REVIEW";

export interface InventoryAdjustmentDTO {
  id: string;
  sku?: string;
  productId?: string;
  quantityDelta: number;
  reason: InventoryAdjustmentReason;
  workOrderId?: string;
  reviewRequired: boolean;
  createdAt: string;
}

export function requiresInventoryReview(adjustment: InventoryAdjustmentDTO): boolean {
  return adjustment.reviewRequired || adjustment.reason === "MANUAL_REVIEW" || adjustment.quantityDelta < 0;
}
