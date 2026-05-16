import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "apps/customer/app/page.tsx",
  "apps/customer/app/api/customer-session/route.ts",
  "apps/customer/app/api/notification-preferences/route.ts",
  "apps/admin/app/reporting/page.tsx",
  "apps/admin/app/notifications/page.tsx",
  "apps/admin/app/maintenance-plans/page.tsx",
  "packages/customer-portal/src/index.ts",
  "packages/maintenance-plans/src/index.ts",
  "packages/notifications/src/index.ts",
  "packages/reporting/src/index.ts",
  "packages/commands/src/customer/CreateCustomerPortalSessionCommand.ts",
  "packages/commands/src/maintenance-plans/CreateMaintenancePlanCommand.ts",
  "packages/commands/src/notifications/QueueCustomerNotificationCommand.ts",
  "packages/commands/src/reporting/CreateOpsReportSnapshotCommand.ts",
  "infra/supabase/migrations/0009_customer_portal_maintenance_notifications_reporting.sql"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing customer ops files:");
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

const scanRoots = [
  "apps/customer",
  "apps/admin/app/reporting",
  "apps/admin/app/notifications",
  "apps/admin/app/maintenance-plans"
];

const forbidden = [
  "@supabase/supabase-js",
  "SUPABASE_SERVICE_ROLE_KEY",
  "insert(",
  "update(",
  "delete(",
  "upsert("
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
  console.error("Customer ops boundary violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Customer portal / maintenance / notification / reporting audit passed.");
