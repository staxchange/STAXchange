import type { PartsReservationDTO } from "./types";

export function markPartsConsumed(reservation: PartsReservationDTO): PartsReservationDTO {
  return {
    ...reservation,
    status: "CONSUMED"
  };
}
