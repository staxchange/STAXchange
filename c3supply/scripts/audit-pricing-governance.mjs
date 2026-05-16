import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/supplier-costs/src/index.ts",
  "packages/margin-rules/src/index.ts",
  "packages/pricing-governance/src/index.ts",
  "packages/commands/src/pricing-governance/CreateSupplierCostRecordCommand.ts",
  "infra/supabase/migrations/0017_pricing_margin_governance.sql",
  "apps/admin/app/api/pricing/approve/route.ts",
  "docs/governance/SUPPLIER_COST_BOUNDARY.md"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error("Missing pricing governance files:");
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

const publicFiles = [
  ...walk("apps/storefront"),
  ...walk("apps/c3-storefront")
].filter((file) => /\.(ts|tsx)$/.test(file));

const publicBanned = ["supplierCost", "supplier cost", "costCents", "supplier_cost", "Goodwater cost"];
const publicViolations = publicFiles.flatMap((file) => {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  return publicBanned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
});

const adminApiFiles = walk("apps/admin/app/api/pricing").filter((file) => /\.(ts|tsx)$/.test(file));
const appMutationBanned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert("];
const apiViolations = adminApiFiles.flatMap((file) => {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  return appMutationBanned.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
});

const pricingRules = fs.readFileSync(path.join(process.cwd(), "packages/pricing-governance/src/pricing-rules.ts"), "utf8");
const quoteDocRules = fs.existsSync(path.join(process.cwd(), "packages/quote-documents/src/quote-document-rules.ts"))
  ? fs.readFileSync(path.join(process.cwd(), "packages/quote-documents/src/quote-document-rules.ts"), "utf8")
  : "";

const logicViolations = [];
if (!pricingRules.includes("pricingApprovalRequiredBeforeQuoteDocumentApproval")) {
  logicViolations.push("pricing governance must expose quote document pricing approval gate.");
}
if (!quoteDocRules.includes("quoteDocumentApprovalRequiresPricingApproval")) {
  logicViolations.push("quote document rules must require pricing approval.");
}

const language = ["autonomous pricing", "automatic price recommendation"];
const languageViolations = adminApiFiles.flatMap((file) => {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  return language.filter((token) => text.includes(token)).map((token) => `${file} contains ${token}`);
});

const violations = [...publicViolations, ...apiViolations, ...logicViolations, ...languageViolations];

if (violations.length) {
  console.error("Pricing governance audit violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Pricing governance audit passed.");
