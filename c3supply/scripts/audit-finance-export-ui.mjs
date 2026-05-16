import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/finance-export-ui/src/index.ts",
  "apps/admin/app/billing/simply-accounting-export/page.tsx",
  "apps/admin/app/billing/simply-accounting-export/[batchId]/page.tsx",
  "apps/admin/components/accounting-export/ExportFileList.tsx",
  "apps/admin/components/accounting-export/FinanceApprovalPanel.tsx",
  "apps/admin/components/accounting-export/SignedDownloadPanel.tsx",
  "apps/admin/components/accounting-export/ReconciliationNotePanel.tsx",
  "apps/admin/components/accounting-export/ExportHistoryTimeline.tsx",
  "apps/admin/components/accounting-export/ExportActionPanel.tsx",
  "packages/commands/src/billing/RejectSimplyAccountingDownloadCommand.ts",
  "apps/admin/app/api/billing/simply-accounting/reject-download/route.ts",
  "infra/supabase/migrations/0012_simply_accounting_finance_review_ui.sql"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing finance export UI files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

function walk(dir) {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).flatMap((entry) => {
    const abs = path.join(full, entry);
    const rel = path.relative(process.cwd(), abs);
    return fs.statSync(abs).isDirectory() ? walk(rel) : [rel];
  });
}

const roots = [
  "apps/admin/app/billing/simply-accounting-export",
  "apps/admin/components/accounting-export",
  "packages/finance-export-ui"
];

const forbidden = [
  "@supabase/supabase-js",
  "SUPABASE_SERVICE_ROLE_KEY",
  "simplyAccountingApi",
  "directAccountingSync",
  "postToAccounting",
  "autoPostAccountingEntry"
];

const violations = [];

for (const file of roots.flatMap(walk).filter((item) => /\.(ts|tsx)$/.test(item))) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) violations.push(`${file} contains forbidden token ${token}`);
  }
}

if (violations.length) {
  console.error("Finance export UI boundary violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Finance export UI audit passed.");
