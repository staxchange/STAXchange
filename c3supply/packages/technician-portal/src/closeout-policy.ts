export function validateCloseout(input: { findings?: string; actionsTaken?: string }): void {
  if (!input.findings?.trim()) throw new Error("Closeout findings are required.");
  if (!input.actionsTaken?.trim()) throw new Error("Closeout actionsTaken is required.");
}

export function closeoutRequiresManagerReview(): true {
  return true;
}
