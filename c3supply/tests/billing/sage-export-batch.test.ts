import { createSageExportBatchDTO, sageExportIsPrepOnly } from "@stax/service-billing";

test("Simply Accounting export is prep only", () => {
  expect(sageExportIsPrepOnly()).toBe(true);
});

test("creates Simply Accounting export batch DTO", () => {
  const batch = createSageExportBatchDTO("BATCH-001", 2);

  expect(batch.batchNumber).toBe("BATCH-001");
  expect(batch.status).toBe("CREATED");
  expect(batch.itemCount).toBe(2);
});
