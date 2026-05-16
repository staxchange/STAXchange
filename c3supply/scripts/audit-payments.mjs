import fs from "node:fs";
import path from "node:path";
const required = [
  "packages/payments/src/index.ts",
  "packages/stripe-payments/src/index.ts",
  "packages/commands/src/payments/CreatePaymentRequestCommand.ts",
  "apps/storefront/app/api/stripe/webhook/route.ts",
  "infra/supabase/migrations/0019_stripe_payment_deposit_phase1.sql",
  "docs/governance/PAYMENT_BOUNDARY.md"
];
const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) { console.error("Missing payment files:"); console.error(missing.join("\n")); process.exit(1); }
function walk(dir) { const full = path.join(process.cwd(), dir); if (!fs.existsSync(full)) return []; return fs.readdirSync(full).flatMap((entry) => { const abs = path.join(full, entry); const rel = path.relative(process.cwd(), abs); return fs.statSync(abs).isDirectory() ? walk(rel) : [rel]; }); }
const apiFiles = ["apps/admin/app/api/payments","apps/customer/app/api/payments","apps/storefront/app/api/payments","apps/c3-storefront/app/api/payments","apps/storefront/app/api/stripe"].flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f));
const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert(", "postToAccounting", "directAccountingSync", "autoPostAccountingEntry"];
const violations = [];
for (const file of apiFiles) { const text = fs.readFileSync(path.join(process.cwd(), file), "utf8"); for (const token of banned) if (text.includes(token)) violations.push(`${file} contains ${token}`); }
const publicFiles = ["apps/storefront", "apps/c3-storefront", "apps/customer"].flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f));
const publicBanned = ["supplierCost", "supplier cost", "costCents", "supplier_cost", "DWG Process Supply internal", "NEXT_PUBLIC_STRIPE_SECRET_KEY"];
for (const file of publicFiles) { const text = fs.readFileSync(path.join(process.cwd(), file), "utf8"); for (const token of publicBanned) if (text.includes(token)) violations.push(`${file} contains public forbidden token ${token}`); }
const rules = fs.readFileSync(path.join(process.cwd(), "packages/payments/src/payment-request-rules.ts"), "utf8");
if (!rules.includes("paymentRequestRequiresAcceptedQuote") || !rules.includes("paymentSuccessDoesNotAutoFulfill") || !rules.includes("paymentSuccessDoesNotPostAccounting")) violations.push("payment rules missing required governance gates");
if (violations.length) { console.error("Payment audit violations:"); console.error(violations.join("\n")); process.exit(1); }
console.log("Payments audit passed.");
