import type { ExportStorageFileKind } from "./types";

export const defaultSimplyAccountingExportBucket = "simply-accounting-export-files";

export function storagePathForExportFile(input: {
  batchNumber: string;
  fileKind: ExportStorageFileKind;
  fileName: string;
}): string {
  const safeBatch = input.batchNumber.replace(/[^a-zA-Z0-9-_]/g, "-");
  const safeName = input.fileName.replace(/[^a-zA-Z0-9-_.]/g, "-");

  return `simply-accounting/${safeBatch}/${input.fileKind.toLowerCase()}/${safeName}`;
}

export function exportStorageRequiresFinanceApproval(): true {
  return true;
}

export function accountingDirectSyncIsDisabled(): false {
  return false;
}
