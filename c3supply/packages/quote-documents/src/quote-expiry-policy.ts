import type { QuoteValidityWindow } from "./types";

export function quoteIsExpired(validity: QuoteValidityWindow, now = new Date()): boolean {
  return new Date(validity.validUntil).getTime() <= now.getTime();
}

export function expiredQuoteCanBeAccepted(): false {
  return false;
}
