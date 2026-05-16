import type { LaborEntryDTO } from "./types";

export function laborEntryTotalCents(entry: LaborEntryDTO): number {
  if (!entry.rateCents) return 0;
  return Math.round(entry.hours * entry.rateCents);
}

export function validateLaborHours(hours: number): boolean {
  return Number.isFinite(hours) && hours > 0 && hours <= 24;
}
