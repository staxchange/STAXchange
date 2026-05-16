import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/service-billing/src/index.ts",
  "packages/parts-inventory/src/index.ts",
  "packages/commands/src/billing/CreateLaborEntryCommand.ts",
  "packages/commands/src/billing/AddServicePartUsedCommand.ts",
  "packages/commands/src/billing/CreateServiceInvoiceDraftCommand.ts",
  "packages/commands/src/billing/AddInvoiceLineItemCommand.ts",
  "packages/commands/src/billing/SubmitInvoiceForReviewCommand.ts",
  "packages/commands/src/billing/ApproveServiceInvoiceCommand.ts",
  "packages/commands/src/billing/RejectServiceInvoiceCommand.ts",
  "packages/commands/src/billing/CreateBillingPacketCommand.ts",
  "packages/commands/src/billing/CreateSageExportBatchCommand.ts",
  "packages/commands/src/billing/MarkSageExportBatchReadyCommand.ts",
  "packages/commands/src/billing/RecordInventoryAdjustmentCommand.ts",
  "packages/commands/src/billing/CreateMaintenanceFollowupCommand.ts",
  "apps/admin/app/billing/page.tsx",
  "apps/admin/app/api/billing/service-invoice/route.ts",
  "apps/technician/app/work-orders/[workOrderId]/labor/page.tsx",
  "apps/technician/app/work-orders/[workOrderId]/parts/page.tsx",
  "infra/supabase/migrations/0008_service_billing_inventory_sage.sql",
  "docs/workflows/SIMPLY_ACCOUNTING_EXPORT_PREP.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing service billing files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const scanRoots = [
  "apps/admin/app/billing",
  "apps/admin/app/api/billing",
  "apps/technician/app/work-orders"
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

const forbidden = [
  "@supabase/supabase-js",
  "SUPABASE_SERVICE_ROLE_KEY",
  "insert(",
  "update(",
  "delete(",
  "upsert(",
  "sageApi",
  "simplyAccountingApi",
  "directSageSync",
  "directAccountingSync",
  "postToSage",
  "postToAccounting",
  "autoPostAccountingEntry"
];

const violations = [];

for (const file of scanRoots.flatMap(walk).filter((item) => /\.(ts|tsx)$/.test(item))) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) {
      violations.push(`${file} contains forbidden token ${token}`);
    }
  }
}

if (violations.length) {
  console.error("Service billing boundary violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Service billing audit passed.");
