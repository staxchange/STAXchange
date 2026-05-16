export type ManagerReviewDecision = "APPROVED" | "REJECTED";

export function validateManagerReview(input: { decision: ManagerReviewDecision; reason?: string }): void {
  if (input.decision === "REJECTED" && !input.reason?.trim()) {
    throw new Error("Rejection reason is required.");
  }
}
