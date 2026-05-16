import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/e2e-readiness/src/index.ts",
  "scripts/seed-demo-commerce-dry-run.mjs",
  "fixtures/demo-commerce/products.sample.json",
  "fixtures/demo-commerce/accounting-handoff.sample.json",
  "packages/workflows/src/definitions/commerce-quote.ts",
  "packages/workflows/src/definitions/quote-document.ts",
  "packages/workflows/src/definitions/quote-delivery.ts",
  "packages/workflows/src/definitions/payments.ts",
  "packages/workflows/src/definitions/fulfillment.ts",
  "packages/workflows/src/definitions/supplier-purchasing.ts",
  "packages/workflows/src/definitions/commerce-billing.ts",
  "packages/workflows/src/definitions/accounting-handoff.ts",
  "scripts/audit-commerce-billing.mjs",
  "scripts/audit-accounting-handoff.mjs",
  "scripts/audit-payments.mjs",
  "scripts/audit-quote-delivery.mjs",
  "scripts/audit-pricing-governance.mjs"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

function walk(dir) {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).flatMap((entry) => {
    const abs = path.join(full, entry);
    const rel = path.relative(process.cwd(), abs);
    if (rel.includes("node_modules") || rel.includes(".next") || rel.includes("dist")) return [];
    return fs.statSync(abs).isDirectory() ? walk(rel) : [rel];
  });
}

const publicFiles = ["apps/storefront", "apps/c3-storefront", "apps/customer"].flatMap(walk).filter((file) => /\.(ts|tsx)$/.test(file));
const bannedPublic = ["supplierCost", "supplier cost", "costCents", "supplier_cost", "marginPercent"];
const c3Files = walk("apps/c3-storefront").filter((file) => /\.(ts|tsx)$/.test(file));
const c3Banned = ["DWG Process Supply", "technician portal", "Simply Accounting"];

const implementationFiles = ["apps/storefront", "apps/c3-storefront", "apps/customer", "apps/admin", "apps/technician", "packages/commands", "packages/workflows"]
  .flatMap(walk)
  .filter((item) => /\.(ts|tsx|mjs|js)$/.test(item));

const bannedImplementation = ["cards_master", "vault_items", "collectibles trust score"];
const violations = [];

for (const file of publicFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of bannedPublic) {
    if (text.includes(token)) violations.push(`${file} exposes ${token}`);
  }
}

for (const file of c3Files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of c3Banned) {
    if (text.includes(token)) violations.push(`${file} exposes C3-forbidden language ${token}`);
  }
}

for (const file of implementationFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of bannedImplementation) {
    if (text.includes(token)) violations.push(`${file} contains Collectibles vertical phrase ${token}`);
  }
}

if (missing.length || violations.length) {
  if (missing.length) console.error("Missing files:\n" + missing.join("\n"));
  if (violations.length) console.error("Violations:\n" + violations.join("\n"));
  process.exit(1);
}

console.log("E2E commerce readiness audit passed.");
