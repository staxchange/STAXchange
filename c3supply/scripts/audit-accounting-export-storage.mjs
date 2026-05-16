import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/accounting-export-storage/src/index.ts",
  "packages/accounting-export-storage/src/storage-policy.ts",
  "packages/accounting-export-storage/src/download-policy.ts",
  "packages/accounting-export-storage/src/supabase-export-storage-repository.ts",
  "packages/commands/src/billing/StoreSimplyAccountingExportFileCommand.ts",
  "packages/commands/src/billing/ApproveSimplyAccountingDownloadCommand.ts",
  "packages/commands/src/billing/CreateSimplyAccountingSignedDownloadCommand.ts",
  "packages/commands/src/billing/MarkSimplyAccountingExportedCommand.ts",
  "packages/commands/src/billing/MarkSimplyAccountingExportFailedCommand.ts",
  "packages/commands/src/billing/AddSimplyAccountingReconciliationNoteCommand.ts",
  "packages/commands/src/billing/ArchiveSimplyAccountingExportBatchCommand.ts",
  "apps/admin/app/api/billing/simply-accounting/store-export-file/route.ts",
  "apps/admin/app/api/billing/simply-accounting/approve-download/route.ts",
  "apps/admin/app/billing/simply-accounting-export/[batchId]/page.tsx",
  "infra/supabase/migrations/0011_simply_accounting_export_storage_downloads.sql"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing accounting export storage files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const forbidden = [
  "simplyAccountingApi",
  "directAccountingSync",
  "postToAccounting",
  "autoPostAccountingEntry"
];

function walk(dir) {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).flatMap((entry) => {
    const abs = path.join(full, entry);
    const rel = path.relative(process.cwd(), abs);
    return fs.statSync(abs).isDirectory() ? walk(rel) : [rel];
  });
}

const files = [
  ...walk("apps/admin/app/api/billing/simply-accounting"),
  ...walk("apps/admin/app/billing/simply-accounting-export"),
  ...walk("packages/accounting-export-storage")
].filter((file) => /\.(ts|tsx)$/.test(file));

const violations = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) {
      violations.push(`${file} contains forbidden token ${token}`);
    }
  }
}

if (violations.length) {
  console.error("Accounting export storage boundary violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Simply Accounting export storage audit passed.");
