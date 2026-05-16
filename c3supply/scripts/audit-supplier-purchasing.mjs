import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/supplier-purchasing/src/index.ts",
  "packages/commands/src/supplier-purchasing/DraftSupplierPurchaseOrderCommand.ts",
  "apps/admin/app/api/supplier-po/draft/route.ts",
  "apps/admin/app/api/dropship/prepare/route.ts"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error(`Missing supplier purchasing files:\n${missing.join("\n")}`);
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
  ...walk("apps/admin/app/api/supplier-po"),
  ...walk("apps/admin/app/api/dropship")
].filter((file) => /\.(ts|tsx)$/.test(file));

const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert(", "auto-send", "auto send", "auto-order", "auto order", "accounting sync"];
const violations = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of banned) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

const rules = fs.readFileSync(path.join(process.cwd(), "packages/supplier-purchasing/src/supplier-po-rules.ts"), "utf8");
if (!rules.includes("supplierPOAutoSendAllowed(): false")) violations.push("Supplier PO auto-send must be false.");

if (violations.length) {
  console.error(`Supplier purchasing audit violations:\n${violations.join("\n")}`);
  process.exit(1);
}

console.log("Supplier purchasing audit passed.");
