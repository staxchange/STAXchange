import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/fulfillment/src/index.ts",
  "packages/commands/src/fulfillment/CreateFulfillmentPlanCommand.ts",
  "apps/admin/app/api/fulfillment/create-plan/route.ts",
  "apps/customer/app/api/fulfillment/status/route.ts",
  "infra/supabase/migrations/0020_fulfillment_supplier_po_phase1.sql"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error(`Missing fulfillment files:\n${missing.join("\n")}`);
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

const files = [
  ...walk("apps/admin/app/api/fulfillment"),
  ...walk("apps/customer/app/api/fulfillment"),
  ...walk("apps/storefront/app/api/order-status"),
  ...walk("apps/c3-storefront/app/api/order-status")
].filter((file) => /\.(ts|tsx)$/.test(file));

const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert(", "auto-fulfill", "auto fulfillment", "accounting sync", "cards_master", "vault_items"];
const violations = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of banned) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

const publicFiles = [
  ...walk("apps/customer"),
  ...walk("apps/storefront"),
  ...walk("apps/c3-storefront")
].filter((file) => /\.(ts|tsx)$/.test(file));

for (const file of publicFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of ["supplier PO", "supplier cost", "supplierCost", "costCents"]) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

if (violations.length) {
  console.error(`Fulfillment audit violations:\n${violations.join("\n")}`);
  process.exit(1);
}

console.log("Fulfillment audit passed.");
