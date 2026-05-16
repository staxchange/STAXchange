import type { PartsReservationDTO } from "./types";

export function createPartsReservation(input: {
  id: string;
  workOrderId: string;
  sku: string;
  quantity: number;
}): PartsReservationDTO {
  if (input.quantity <= 0) throw new Error("Reservation quantity must be positive.");

  return {
    id: input.id,
    workOrderId: input.workOrderId,
    sku: input.sku,
    quantity: input.quantity,
    status: "RESERVED"
  };
}
