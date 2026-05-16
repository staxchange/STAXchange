export interface CartLine {
  productId: string;
  quantity: number;
}

export function cartLineTotalQuantity(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export const commercePackageReady = true;
