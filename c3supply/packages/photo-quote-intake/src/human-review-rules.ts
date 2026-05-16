import type { HumanReviewRequiredReason, PhotoQuoteIntakeDTO } from "./types";
import { missingRequiredPhotos } from "./photo-requirements";

export function humanReviewAlwaysRequired(): true {
  return true;
}

export function humanReviewReasons(intake: PhotoQuoteIntakeDTO): HumanReviewRequiredReason[] {
  const reasons = new Set<HumanReviewRequiredReason>();
  reasons.add("PHOTO_QUOTE_ALWAYS_REQUIRES_HUMAN_REVIEW");

  if (!intake.customerName && !intake.customerEmail && !intake.customerPhone) {
    reasons.add("MISSING_CUSTOMER_INFO");
  }

  if (!intake.siteName) {
    reasons.add("MISSING_SITE_INFO");
  }

  if (!intake.notes?.trim()) {
    reasons.add("MISSING_OPERATOR_NOTES");
  }

  if (missingRequiredPhotos(intake).length) {
    reasons.add("MISSING_OVERVIEW_PHOTO");
  }

  return Array.from(reasons);
}
