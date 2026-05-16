import type { ServicePartUsedDTO } from "./types";

export function partsUsedTotalCostCents(part: ServicePartUsedDTO): number {
  if (!part.unitCostCents) return 0;
  return Math.round(part.quantity * part.unitCostCents);
}

export function validatePartQuantity(quantity: number): boolean {
  return Number.isFinite(quantity) && quantity > 0 && quantity <= 999;
}
