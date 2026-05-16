import type { SimplyAccountingBatchManifest, SimplyAccountingExportBatch, SimplyAccountingExportFile } from "./types";

export function createSimplyAccountingBatchManifest(
  batch: SimplyAccountingExportBatch,
  files: SimplyAccountingExportFile[]
): SimplyAccountingBatchManifest {
  return {
    batchId: batch.id,
    batchNumber: batch.batchNumber,
    status: batch.status,
    format: batch.format,
    files: files.map((file) => ({
      fileName: file.fileName,
      rowCount: file.rowCount
    })),
    generatedAt: new Date().toISOString()
  };
}
