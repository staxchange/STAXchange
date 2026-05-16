import fs from "node:fs";
import path from "node:path";
const required = [
  "packages/quote-documents/src/index.ts",
  "packages/commands/src/quote-documents/CreateQuoteDocumentCommand.ts",
  "apps/admin/app/api/quote-documents/create/route.ts",
  "apps/customer/app/api/quote-documents/accept/route.ts",
  "apps/storefront/app/quote-view/[token]/page.tsx",
  "apps/c3-storefront/app/quote-view/[token]/page.tsx",
  "infra/supabase/migrations/0016_quote_documents_acceptance.sql"
];
const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) { console.error("Missing quote document files:\n" + missing.join("\n")); process.exit(1); }
function walk(dir) { const full = path.join(process.cwd(), dir); if (!fs.existsSync(full)) return []; return fs.readdirSync(full).flatMap((entry) => { const abs = path.join(full, entry); const rel = path.relative(process.cwd(), abs); return fs.statSync(abs).isDirectory() ? walk(rel) : [rel]; }); }
const roots = ["apps/admin/app/api/quote-documents", "apps/customer/app/api/quote-documents", "apps/storefront/app/api/quote-view", "apps/c3-storefront/app/api/quote-view"];
const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert(", "autonomous pricing", "recommended price", "cards_master", "vault_items", "break room"];
const violations = [];
for (const file of roots.flatMap(walk).filter((f) => /\.(ts|tsx)$/.test(f))) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of banned) if (text.includes(token)) violations.push(`${file} contains ${token}`);
}
const rules = fs.readFileSync(path.join(process.cwd(), "packages/quote-documents/src/quote-document-rules.ts"), "utf8");
if (!rules.includes("approvedCommerceQuote") || !rules.includes("documentApproved")) violations.push("Quote document rules must enforce approved quote/document approval.");
const acceptance = fs.readFileSync(path.join(process.cwd(), "packages/quote-documents/src/customer-acceptance-policy.ts"), "utf8");
if (!acceptance.includes("quoteExpired") || !acceptance.includes("shareLinkIsValid")) violations.push("Acceptance policy must enforce expiry/share link validity.");
if (violations.length) { console.error("Quote document audit violations:\n" + violations.join("\n")); process.exit(1); }
console.log("Quote documents audit passed.");
