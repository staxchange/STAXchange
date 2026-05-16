import type { QuoteRequestDTO } from "@stax/core-contracts";

export function quoteNeedsSalesReview(quote: QuoteRequestDTO): boolean {
  return quote.status === "NEW" || quote.status === "REVIEWING";
}

export const quotesPackageReady = true;
