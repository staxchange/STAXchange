import type { ReconciliationNoteDTO } from "./types";

export function createReconciliationNote(input: {
  batchId: string;
  note: string;
  createdBy: string;
}): ReconciliationNoteDTO {
  if (!input.note.trim()) {
    throw new Error("Reconciliation note is required.");
  }

  return {
    id: `reconciliation-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    batchId: input.batchId,
    note: input.note.trim(),
    createdBy: input.createdBy,
    createdAt: new Date().toISOString()
  };
}
