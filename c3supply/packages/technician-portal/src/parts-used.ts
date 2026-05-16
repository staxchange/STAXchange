export function validatePartQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("Part quantity must be greater than zero.");
  if (quantity > 999) throw new Error("Part quantity is too large.");
  return quantity;
}
