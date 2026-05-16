import type { CartDTO, CartItemDTO } from "./types";
import { deriveCartIntentStatus } from "./rules";

export function createCartDTO(input: { id: string; customerEmail?: string; items?: CartItemDTO[] }): CartDTO {
  const now = new Date().toISOString();
  const items = input.items ?? [];
  return { id: input.id, customerEmail: input.customerEmail, items, status: deriveCartIntentStatus({ items }), createdAt: now, updatedAt: now };
}
