import fs from "node:fs";
import path from "node:path";

const required = [
  "brands/c3-supply/src/brand.ts",
  "apps/c3-storefront/app/layout.tsx",
  "apps/c3-storefront/app/page.tsx",
  "apps/c3-storefront/app/api/cart/create/route.ts",
  "infra/vercel/c3-storefront.vercel.json",
  "docs/deployment/C3_SUPPLY_DEPLOYMENT.md"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error("Missing C3 files:");
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

const files = walk("apps/c3-storefront").filter((f) => /\.(ts|tsx)$/.test(f));
const forbidden = ["DWG Process Supply", "@supabase/supabase-js", "insert(", "update(", "delete(", "upsert(", "cards_master", "vault_items", "break room"];
const violations = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

const brand = fs.readFileSync(path.join(process.cwd(), "brands/c3-supply/src/brand.ts"), "utf8");
if (!brand.includes("c3supply.co") || !brand.includes("C3 Supply Co.")) {
  violations.push("C3 brand must include C3 Supply Co. and c3supply.co.");
}

if (violations.length) {
  console.error("C3 dress audit violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("C3 dress audit passed.");
