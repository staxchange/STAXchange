import fs from "node:fs";
import path from "node:path";

const required = [
  "packages/accounting-handoff/src/index.ts",
  "packages/commands/src/accounting-handoff/CreateAccountingHandoffCommand.ts",
  "apps/admin/app/api/accounting-handoff/mark-ready/route.ts",
  "docs/governance/ACCOUNTING_HANDOFF_BOUNDARY.md"
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

const adminApiFiles = walk("apps/admin/app/api/accounting-handoff").filter((file) => /\.(ts|tsx)$/.test(file));
const banned = ["@supabase/supabase-js", "insert(", "update(", "delete(", "upsert(", "direct accounting sync", "auto-posting entries"];
const violations = [];

for (const file of adminApiFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of banned) {
    if (text.includes(token)) violations.push(`${file} contains ${token}`);
  }
}

if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Accounting handoff audit passed.");
