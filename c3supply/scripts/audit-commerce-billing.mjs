import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/commerce-billing/src/index.ts",
  "packages/commands/src/commerce-billing/CreateCommerceInvoiceDraftCommand.ts",
  "apps/admin/app/api/commerce-billing/approve/route.ts",
  "docs/governance/COMMERCE_BILLING_BOUNDARY.md"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
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

const adminApiFiles = walk("apps/admin/app/api/commerce-billing").filter((file) => /\.(ts|tsx)$/.test(file));
const mutationBanned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert("];
const violations = [];

for (const file of adminApiFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of mutationBanned) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

const publicFiles = [...walk("apps/storefront"), ...walk("apps/c3-storefront")]
  .filter((file) => /\.(ts|tsx)$/.test(file));
const publicBanned = ["supplierCost", "supplier cost", "auto accounting"];

for (const file of publicFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of publicBanned) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Commerce billing audit passed.");
