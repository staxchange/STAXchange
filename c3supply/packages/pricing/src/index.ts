import type { PriceDTO } from "@stax/core-contracts";

export function isPriceFresh(price: PriceDTO, now = new Date()): boolean {
  return price.approved && new Date(price.freshUntil).getTime() > now.getTime();
}

export const pricingPackageReady = true;
