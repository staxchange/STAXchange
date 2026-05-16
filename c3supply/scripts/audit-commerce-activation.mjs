import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/product-catalog/src/index.ts",
  "packages/cart/src/index.ts",
  "packages/quote-workflow/src/index.ts",
  "packages/orders/src/index.ts",
  "packages/commands/src/cart/CreateCartCommand.ts",
  "packages/commands/src/commerce-quotes/CreateCommerceQuoteRequestCommand.ts",
  "packages/workflows/src/definitions/commerce-quote.ts",
  "infra/supabase/migrations/0014_commerce_activation_phase1.sql",
  "apps/storefront/app/cart/page.tsx",
  "apps/storefront/app/checkout-lite/page.tsx",
  "apps/admin/app/commerce/page.tsx"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing commerce files:\n" + missing.join("\n"));
  process.exit(1);
}

function walk(dir) {
  const full = path.join(process.cwd(), dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).flatMap((entry) => {
    const absolute = path.join(full, entry);
    const relative = path.relative(process.cwd(), absolute);
    return fs.statSync(absolute).isDirectory() ? walk(relative) : [relative];
  });
}

const appFiles = [
  ...walk("apps/storefront/app/api/cart"),
  ...walk("apps/storefront/app/api/commerce-quote"),
  ...walk("apps/admin/app/api/commerce")
].filter((file) => /\.(ts|tsx)$/.test(file));

const forbidden = ["@supabase/supabase-js", "SUPABASE_SERVICE_ROLE_KEY", "insert(", "update(", "delete(", "upsert("];
const violations = [];

for (const file of appFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

const contentFiles = [
  ...walk("apps/storefront/app/catalog"),
  ...walk("apps/storefront/app/cart"),
  ...walk("apps/storefront/app/checkout-lite")
].filter((file) => /\.(ts|tsx)$/.test(file));

const badTerms = ["recommendation engine", "ai recommendation", "autonomous sizing", "cards_master", "vault_items", "break room", "collectibles trust score"];

for (const file of contentFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8").toLowerCase();
  for (const term of badTerms) {
    if (text.includes(term)) violations.push(`${file} contains blocked commerce language ${term}`);
  }
}

const rules = fs.readFileSync(path.join(process.cwd(), "packages/product-catalog/src/rules.ts"), "utf8");
if (!rules.includes("productRequiresQuote")) violations.push("quote-required product routing rule missing");

if (violations.length) {
  console.error("Commerce activation audit failed:\n" + violations.join("\n"));
  process.exit(1);
}

console.log("Commerce activation audit passed.");
