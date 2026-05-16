export const allowedEquipmentExtractionOutputs = [
  "visible label text",
  "model candidate",
  "serial candidate",
  "equipment category candidate",
  "missing photo checklist",
  "human-review summary"
] as const;

export const forbiddenEquipmentExtractionOutputs = [
  "final quote",
  "final price",
  "system sizing",
  "compatibility confirmation",
  "repair instruction",
  "engineering conclusion",
  "warranty decision",
  "safety decision"
] as const;

export function aiExtractionIsFinal(): false {
  return false;
}

export function extractionCandidateIsVerified(): false {
  return false;
}

export function extractionTextViolatesPolicy(text: string): boolean {
  const normalized = text.toLowerCase();
  return forbiddenEquipmentExtractionOutputs.some((item) => normalized.includes(item));
}
