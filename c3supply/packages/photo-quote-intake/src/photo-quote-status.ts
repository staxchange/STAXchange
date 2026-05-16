import type { PhotoQuoteStatus } from "./types";

export function canConvertPhotoQuoteToCommerceQuote(status: PhotoQuoteStatus): boolean {
  return status === "HUMAN_REVIEW_REQUIRED" || status === "MORE_INFO_REQUIRED";
}

export function photoQuoteIsClosed(status: PhotoQuoteStatus): boolean {
  return status === "CLOSED";
}
