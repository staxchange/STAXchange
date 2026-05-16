import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/authz/src/index.ts",
  "packages/authz/src/route-policies.ts",
  "packages/authz/src/role-guards.ts",
  "packages/authz/src/server-actor.ts",
  "apps/admin/middleware.ts",
  "apps/customer/middleware.ts",
  "apps/technician/middleware.ts",
  "apps/admin/app/unauthorized/page.tsx",
  "apps/customer/app/unauthorized/page.tsx",
  "apps/technician/app/unauthorized/page.tsx",
  "infra/supabase/migrations/0013_auth_roles_route_guards.sql",
  "docs/architecture/ROLE_BASED_ROUTE_GUARDS.md",
  "packages/authz/src/supabase-session-bridge.ts",
  "tests/authz/supabase-session-bridge.test.ts",
  "tests/authz/production-route-guards.test.ts",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing auth guard files:");
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

const roots = ["apps/admin", "apps/customer", "apps/technician", "packages/authz"];
const forbidden = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "directAccountingSync",
  "postToAccounting",
  "autoPostAccountingEntry"
];

const violations = [];

for (const file of roots.flatMap(walk).filter((item) => /\.(ts|tsx)$/.test(item))) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of forbidden) {
    if (text.includes(token)) violations.push(`${file} contains forbidden token ${token}`);
  }
}

if (violations.length) {
  console.error("Auth guard boundary violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Auth guard audit passed.");
