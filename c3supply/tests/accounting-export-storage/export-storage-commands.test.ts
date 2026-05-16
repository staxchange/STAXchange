import {
  ApproveSimplyAccountingDownloadCommand,
  MarkSimplyAccountingExportedCommand,
  StoreSimplyAccountingExportFileCommand
} from "@stax/commands";

test("stores export file through command", async () => {
  const result = await new StoreSimplyAccountingExportFileCommand().run(
    {
      batchId: "batch-1",
      fileName: "customers.csv",
      fileKind: "CUSTOMERS_CSV",
      storageBucket: "simply-accounting-export-files",
      storagePath: "simply-accounting/batch/customers.csv",
      rowCount: 1
    },
    { actor: { id: "finance-1", role: "FINANCE" }, requestId: "test" }
  );

  expect(result.ok).toBe(true);
  expect(result.data?.status).toBe("STORED");
});

test("approves download through finance command", async () => {
  const result = await new ApproveSimplyAccountingDownloadCommand().run(
    { batchId: "batch-1", approvedBy: "finance-1" },
    { actor: { id: "finance-1", role: "FINANCE" }, requestId: "test" }
  );

  expect(result.ok).toBe(true);
  expect(result.data?.status).toBe("DOWNLOAD_APPROVED");
});

test("marks exported through finance command", async () => {
  const result = await new MarkSimplyAccountingExportedCommand().run(
    { batchId: "batch-1", exportedBy: "finance-1" },
    { actor: { id: "finance-1", role: "FINANCE" }, requestId: "test" }
  );

  expect(result.ok).toBe(true);
  expect(result.data?.status).toBe("EXPORTED");
});
