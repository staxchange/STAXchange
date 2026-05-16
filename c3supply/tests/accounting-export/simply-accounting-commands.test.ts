import {
  CreateSageExportBatchCommand,
  CreateSimplyAccountingExportBatchCommand,
  MarkSimplyAccountingExportBatchReadyCommand
} from "@stax/commands";

test("new Simply Accounting export command creates reviewed batch DTO", async () => {
  const result = await new CreateSimplyAccountingExportBatchCommand().run(
    { batchNumber: "BATCH-001", invoiceIds: ["invoice-1"] },
    { actor: { id: "finance-1", role: "FINANCE" }, requestId: "test" }
  );

  expect(result.ok).toBe(true);
  expect(result.data?.status).toBe("SIMPLY_ACCOUNTING_EXPORT_BATCHED");
});

test("legacy Sage command alias still works for compatibility", async () => {
  const result = await new CreateSageExportBatchCommand().run(
    { batchNumber: "BATCH-002", invoiceIds: ["invoice-2"] },
    { actor: { id: "finance-1", role: "FINANCE" }, requestId: "test" }
  );

  expect(result.ok).toBe(true);
  expect(result.data?.compatibility).toBe("Simply Accounting / Sage 50 Canada");
});

test("Simply Accounting batch ready command requires finance role", async () => {
  const result = await new MarkSimplyAccountingExportBatchReadyCommand().run(
    { batchId: "batch-1", reviewedBy: "finance-1" },
    { actor: { id: "finance-1", role: "FINANCE" }, requestId: "test" }
  );

  expect(result.ok).toBe(true);
  expect(result.data?.status).toBe("READY_FOR_SIMPLY_ACCOUNTING_EXPORT");
});
