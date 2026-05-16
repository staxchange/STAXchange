import fs from "node:fs";
import path from "node:path";
const required = [
  "packages/quote-delivery/src/index.ts",
  "packages/commands/src/quote-delivery/CreateQuoteDeliveryCommand.ts",
  "packages/workflows/src/definitions/quote-delivery.ts",
  "infra/supabase/migrations/0018_quote_delivery_notifications.sql",
  "apps/admin/app/api/quote-delivery/create/route.ts",
  "apps/customer/app/api/quote-delivery/accept/route.ts",
  "apps/storefront/app/api/quote-delivery/accept/route.ts",
  "apps/c3-storefront/app/api/quote-delivery/accept/route.ts",
  "packages/notifications/src/quote-delivery-notifications.ts"
];
const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) { console.error("Missing quote delivery files:"); console.error(missing.join("\n")); process.exit(1); }
function walk(dir) { const full = path.join(process.cwd(), dir); if (!fs.existsSync(full)) return []; return fs.readdirSync(full).flatMap((entry) => { const abs = path.join(full, entry); const rel = path.relative(process.cwd(), abs); return fs.statSync(abs).isDirectory() ? walk(rel) : [rel]; }); }
const appRoots = ["apps/admin/app/api/quote-delivery", "apps/customer/app/api/quote-delivery", "apps/storefront/app/api/quote-delivery", "apps/c3-storefront/app/api/quote-delivery"];
const bannedMutation = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert("];
const publicRoots = ["apps/customer/app", "apps/storefront/app", "apps/c3-storefront/app"];
const publicBanned = ["supplierCost", "supplier cost", "costCents", "supplier_cost", "marginPercent"];
const languageBanned = ["autonomous pricing", "automatic price recommendation", "cards_master", "vault_items", "break room"];
const violations = [];
for (const file of appRoots.flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f))) { const text = fs.readFileSync(path.join(process.cwd(), file), "utf8"); for (const token of bannedMutation) if (text.includes(token)) violations.push(`${file} contains ${token}`); }
for (const file of publicRoots.flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f))) { const text = fs.readFileSync(path.join(process.cwd(), file), "utf8"); for (const token of publicBanned) if (text.includes(token)) violations.push(`${file} contains public-cost token ${token}`); }
for (const file of ["packages/quote-delivery/src/quote-delivery-rules.ts", "packages/quote-delivery/src/share-token-policy.ts"]) { const text = fs.readFileSync(path.join(process.cwd(), file), "utf8"); for (const token of languageBanned) if (text.includes(token)) violations.push(`${file} contains ${token}`); }
const rules = fs.readFileSync(path.join(process.cwd(), "packages/quote-delivery/src/quote-delivery-rules.ts"), "utf8");
if (!rules.includes("quoteDeliveryRequiresApprovedLockedPricing") || !rules.includes("quoteDeliveryRequiresApprovedDocument")) violations.push("Quote delivery must require approved locked pricing and approved document.");
const notify = fs.readFileSync(path.join(process.cwd(), "packages/notifications/src/quote-delivery-notifications.ts"), "utf8");
if (!notify.includes("SKIPPED") || !notify.includes("No recipient configured")) violations.push("Quote delivery notification must be provider-safe.");
if (violations.length) { console.error("Quote delivery audit violations:"); console.error(violations.join("\n")); process.exit(1); }
console.log("Quote delivery audit passed.");
