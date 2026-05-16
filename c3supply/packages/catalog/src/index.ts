import type { ProductDTO } from "@stax/core-contracts";

export function isPublishable(product: ProductDTO): boolean {
  return product.status === "APPROVED";
}

export const catalogPackageReady = true;
