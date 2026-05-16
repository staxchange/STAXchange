import { createSimplyAccountingSignedDownload, simplyAccountingStorageConfig } from "@stax/accounting-export-storage";

test("creates Simply Accounting signed download", async () => {
  const client = { storage: { from: () => ({ createSignedUrl: async () => ({ data: { signedUrl: "https://download" }, error: null }) }) } };
  const result = await createSimplyAccountingSignedDownload({ client, objectPath: "exports/file.csv", config: simplyAccountingStorageConfig({ SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET: "simply-accounting-export-files" }) });
  expect(result.signedUrl).toBe("https://download");
});
