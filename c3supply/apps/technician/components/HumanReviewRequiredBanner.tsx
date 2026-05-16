import { technicianCopy } from "../lib/technician-copy";

export function HumanReviewRequiredBanner() {
  return <div className="banner"><strong>Human technical review boundary.</strong><p>{technicianCopy.humanReview}</p></div>;
}
