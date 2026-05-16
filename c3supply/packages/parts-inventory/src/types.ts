export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "REVIEW_REQUIRED";

export interface PartInventoryItemDTO {
  id: string;
  sku: string;
  description: string;
  quantityOnHand: number;
  quantityReserved: number;
  reorderPoint?: number;
  status: InventoryStatus;
}

export interface PartsReservationDTO {
  id: string;
  workOrderId: string;
  sku: string;
  quantity: number;
  status: "RESERVED" | "CONSUMED" | "RELEASED";
}
