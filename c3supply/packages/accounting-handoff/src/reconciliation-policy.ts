export function reconciliationNotesAreFinanceOnly(): true { return true; }
export function canMarkReconciled(input: { exportedManually: boolean; notePresent: boolean }): boolean { return input.exportedManually && input.notePresent; }
