import type {
  SimplyAccountingExportBatch,
  SimplyAccountingInvoiceLineRow,
  SimplyAccountingInvoiceRow
} from "./types";

export function validateInvoiceRow(row: SimplyAccountingInvoiceRow): string[] {
  const errors: string[] = [];

  if (!row.invoiceId) errors.push("invoiceId is required.");
  if (!row.customerId) errors.push("customerId is required.");
  if (!row.invoiceDate) errors.push("invoiceDate is required.");
  if (!row.description) errors.push("description is required.");
  if (row.totalCents < 0) errors.push("totalCents cannot be negative.");

  return errors;
}

export function validateInvoiceLineRow(row: SimplyAccountingInvoiceLineRow): string[] {
  const errors: string[] = [];

  if (!row.invoiceId) errors.push("invoiceId is required.");
  if (!row.lineId) errors.push("lineId is required.");
  if (!row.description) errors.push("description is required.");
  if (row.quantity <= 0) errors.push("quantity must be positive.");
  if (row.totalCents < 0) errors.push("totalCents cannot be negative.");

  return errors;
}

export function validateSimplyAccountingBatch(batch: SimplyAccountingExportBatch): string[] {
  const errors: string[] = [];

  if (!batch.batchNumber) errors.push("batchNumber is required.");
  if (batch.invoiceRows.length === 0) errors.push("At least one invoice row is required.");

  for (const row of batch.invoiceRows) {
    errors.push(...validateInvoiceRow(row).map((error) => `${row.invoiceId}: ${error}`));
  }

  for (const row of batch.invoiceLineRows) {
    errors.push(...validateInvoiceLineRow(row).map((error) => `${row.lineId}: ${error}`));
  }

  return errors;
}
