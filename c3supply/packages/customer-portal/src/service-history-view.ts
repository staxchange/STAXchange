import type { CustomerServiceHistoryItemDTO } from "./types";

export function serviceHistoryVisibleToCustomer(item: CustomerServiceHistoryItemDTO): boolean {
  return item.status === "COMPLETED" || item.status === "CLOSED";
}
