import {
  simplyAccountingCustomerColumns,
  simplyAccountingInvoiceColumns,
  simplyAccountingInvoiceLineColumns
} from "./export-columns";
import { rowsToCsv } from "./csv-builder";
import { validateSimplyAccountingBatch } from "./validation";
import type { SimplyAccountingExportBatch, SimplyAccountingExportFile } from "./types";

function csvFile(fileName: string, content: string, rowCount: number): SimplyAccountingExportFile {
  return {
    fileName,
    mimeType: "text/csv",
    content,
    rowCount,
    generatedAt: new Date().toISOString()
  };
}

export function createSimplyAccountingExportFiles(
  batch: SimplyAccountingExportBatch
): SimplyAccountingExportFile[] {
  const errors = validateSimplyAccountingBatch(batch);

  if (errors.length) {
    throw new Error(`Simply Accounting export batch is invalid: ${errors.join(" | ")}`);
  }

  const prefix = `simply-accounting-${batch.batchNumber}`;

  return [
    csvFile(
      `${prefix}-customers.csv`,
      rowsToCsv(simplyAccountingCustomerColumns, batch.customerRows),
      batch.customerRows.length
    ),
    csvFile(
      `${prefix}-invoices.csv`,
      rowsToCsv(simplyAccountingInvoiceColumns, batch.invoiceRows),
      batch.invoiceRows.length
    ),
    csvFile(
      `${prefix}-invoice-lines.csv`,
      rowsToCsv(simplyAccountingInvoiceLineColumns, batch.invoiceLineRows),
      batch.invoiceLineRows.length
    )
  ];
}
