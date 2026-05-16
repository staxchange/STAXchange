import {
  calculateDownloadExpiry,
  accountingDirectSyncIsDisabled,
  exportStorageRequiresFinanceApproval,
  financeRoleCanApproveDownload,
  storagePathForExportFile
} from "@stax/accounting-export-storage";

test("storage path is sanitized", () => {
  const path = storagePathForExportFile({
    batchNumber: "BATCH 001",
    fileKind: "CUSTOMERS_CSV",
    fileName: "customers file.csv"
  });

  expect(path).toContain("simply-accounting/BATCH-001");
  expect(path).toContain("customers-file.csv");
});

test("finance approval is required", () => {
  expect(exportStorageRequiresFinanceApproval()).toBe(true);
  expect(accountingDirectSyncIsDisabled()).toBe(false);
});

test("finance roles can approve downloads", () => {
  expect(financeRoleCanApproveDownload("FINANCE")).toBe(true);
  expect(financeRoleCanApproveDownload("TECHNICIAN")).toBe(false);
});

test("download expiry is calculated", () => {
  expect(calculateDownloadExpiry()).toContain("T");
});
