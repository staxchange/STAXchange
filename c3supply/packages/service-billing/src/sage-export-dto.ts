import type { SimplyAccountingExportBatchDTO } from "./types";

export function createSimplyAccountingExportBatchDTO(batchNumber: string, itemCount: number): SimplyAccountingExportBatchDTO {
  return {
    id: `sage-batch-${batchNumber}`,
    batchNumber,
    status: "CREATED",
    itemCount,
    createdAt: new Date().toISOString()
  };
}

export function simplyAccountingExportIsPrepOnly(): true {
  return true;
}

// Backward-compatible aliases while command/file names are migrated gradually.
export const createSageExportBatchDTO = createSimplyAccountingExportBatchDTO;
export const sageExportIsPrepOnly = simplyAccountingExportIsPrepOnly;
