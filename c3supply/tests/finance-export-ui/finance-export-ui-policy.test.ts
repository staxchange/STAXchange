import {
  createPlaceholderFinanceExportScreenModel,
  financeExportActionRequiresFinance,
  financeExportAvailableActions,
  financeExportStatusLabel,
  financeExportStatusSeverity
} from "@stax/finance-export-ui";

test("download approval required status exposes approval actions", () => {
  expect(financeExportAvailableActions("DOWNLOAD_APPROVAL_REQUIRED")).toEqual([
    "APPROVE_DOWNLOAD",
    "REJECT_DOWNLOAD"
  ]);
});

test("finance export actions require finance", () => {
  expect(financeExportActionRequiresFinance("APPROVE_DOWNLOAD")).toBe(true);
});

test("status labels and severity are available", () => {
  expect(financeExportStatusLabel("DOWNLOAD_APPROVAL_REQUIRED")).toBe("Download approval required");
  expect(financeExportStatusSeverity("FAILED")).toBe("danger");
});

test("placeholder screen model includes files and history", () => {
  const model = createPlaceholderFinanceExportScreenModel("batch-1");
  expect(model.batch.id).toBe("batch-1");
  expect(model.files.length).toBeGreaterThan(0);
  expect(model.history.length).toBeGreaterThan(0);
});
