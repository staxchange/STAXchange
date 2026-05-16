import { requiresInventoryReview, type InventoryAdjustmentDTO } from "@stax/service-billing";

test("negative inventory adjustment requires review", () => {
  const adjustment: InventoryAdjustmentDTO = {
    id: "adj-1",
    quantityDelta: -1,
    reason: "SERVICE_PART_USED",
    reviewRequired: false,
    createdAt: new Date().toISOString()
  };

  expect(requiresInventoryReview(adjustment)).toBe(true);
});
