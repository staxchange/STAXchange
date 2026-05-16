export type PartsInventoryAdjustmentReason =
  | "SERVICE_PART_USED"
  | "CYCLE_COUNT"
  | "RETURN"
  | "DAMAGED"
  | "MANAGER_CORRECTION";

export function adjustmentReasonRequiresReview(reason: PartsInventoryAdjustmentReason): boolean {
  return reason === "MANAGER_CORRECTION" || reason === "DAMAGED";
}
