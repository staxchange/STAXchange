import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/accounting-export/src/index.ts",
  "packages/accounting-export/src/export-file-packager.ts",
  "packages/accounting-export/src/csv-builder.ts",
  "packages/commands/src/billing/CreateSimplyAccountingExportBatchCommand.ts",
  "packages/commands/src/billing/MarkSimplyAccountingExportBatchReadyCommand.ts",
  "packages/commands/src/billing/GenerateSimplyAccountingExportFileCommand.ts",
  "apps/admin/app/api/billing/simply-accounting-export-file/route.ts",
  "apps/admin/app/billing/simply-accounting-export/page.tsx",
  "infra/supabase/migrations/0010_simply_accounting_export_files.sql",
  "docs/workflows/SIMPLY_ACCOUNTING_EXPORT_FILE_WORKFLOW.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing accounting export files:");
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
  ...walk("apps/admin/app/api/billing"),
  ...walk("apps/admin/app/billing"),
  ...walk("packages/accounting-export")
].filter((file) => /\.(ts|tsx)$/.test(file));

const violations = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) violations.push(`${file} contains forbidden token ${token}`);
  }
}

if (violations.length) {
  console.error("Accounting export boundary violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Simply Accounting export audit passed.");
