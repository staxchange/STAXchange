import {
  InMemoryExportStorageRepository,
  createExportHistoryEvent,
  createReconciliationNote
} from "@stax/accounting-export-storage";

test("stores export file and history in memory", async () => {
  const repo = new InMemoryExportStorageRepository();

  await repo.storeExportFile({
    id: "file-1",
    batchId: "batch-1",
    fileName: "customers.csv",
    fileKind: "CUSTOMERS_CSV",
    storageBucket: "simply-accounting-export-files",
    storagePath: "simply-accounting/batch/customers.csv",
    rowCount: 1,
    status: "STORED",
    createdAt: new Date().toISOString()
  });

  await repo.addHistoryEvent(
    createExportHistoryEvent({
      batchId: "batch-1",
      eventType: "FILES_STORED",
      actorId: "finance-1"
    })
  );

  expect(repo.files).toHaveLength(1);
  expect(repo.history).toHaveLength(1);
});

test("creates reconciliation note", () => {
  const note = createReconciliationNote({
    batchId: "batch-1",
    note: "Imported successfully.",
    createdBy: "finance-1"
  });

  expect(note.note).toBe("Imported successfully.");
});
