import fs from "node:fs";
import path from "node:path";

const required = [
  "apps/technician/package.json",
  "apps/technician/app/page.tsx",
  "apps/technician/app/work-orders/page.tsx",
  "apps/technician/app/api/checklist/route.ts",
  "apps/technician/components/ChecklistRunner.tsx",
  "packages/technician-portal/src/index.ts",
  "packages/commands/src/technician/CreateTechnicianSessionCommand.ts",
  "packages/commands/src/technician/SubmitTechnicianCloseoutCommand.ts",
  "packages/workflows/src/definitions/technician-work-order.ts",
  "infra/supabase/migrations/0007_technician_portal.sql",
  "tests/technician/technician-permissions.test.ts"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error("Missing technician portal files:\n" + missing.join("\n"));
  process.exit(1);
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const files = walk(path.join(process.cwd(), "apps", "technician")).filter((file) => /\.(ts|tsx)$/.test(file));
const banned = ["@supabase/supabase-js", "SUPABASE_SERVICE_ROLE_KEY", "insert(", "update(", "delete("];
const violations = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  for (const token of banned) {
    if (text.includes(token)) violations.push(`${path.relative(process.cwd(), file)} contains banned token ${token}`);
  }
}
if (violations.length) {
  console.error("Technician portal boundary violations:\n" + violations.join("\n"));
  process.exit(1);
}
console.log("Technician portal audit passed.");
