import {
  createSampleSimplyAccountingBatch,
  createSimplyAccountingBatchManifest,
  createSimplyAccountingExportFiles,
  rowsToCsv,
  validateSimplyAccountingBatch
} from "@stax/accounting-export";

test("CSV builder escapes values", () => {
  const csv = rowsToCsv(["name", "note"], [{ name: "Customer, Inc.", note: "Line one" }]);
  expect(csv).toContain('"Customer, Inc."');
});

test("sample Simply Accounting batch validates", () => {
  const batch = createSampleSimplyAccountingBatch();
  expect(validateSimplyAccountingBatch(batch)).toEqual([]);
});

test("creates Simply Accounting export files", () => {
  const batch = createSampleSimplyAccountingBatch();
  const files = createSimplyAccountingExportFiles(batch);

  expect(files).toHaveLength(3);
  expect(files[0].fileName).toContain("simply-accounting");
  expect(files[1].content).toContain("invoiceId");
});

test("creates batch manifest", () => {
  const batch = createSampleSimplyAccountingBatch();
  const files = createSimplyAccountingExportFiles(batch);
  const manifest = createSimplyAccountingBatchManifest(batch, files);

  expect(manifest.batchNumber).toBe(batch.batchNumber);
  expect(manifest.files.length).toBe(3);
});
