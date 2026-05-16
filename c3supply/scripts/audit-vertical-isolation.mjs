import fs from "node:fs";
import path from "node:path";

const rootsToScan = [
  "apps",
  "packages",
  "infra/supabase/migrations",
  ".github/workflows"
];

const allowedFiles = [
  "docs/governance/MOM_DWG_VERTICAL_LOCK.md",
  "docs/governance/FINAL_BOUNDARY_CHECKPOINT.md",
  "docs/governance/PRODUCTION_HARDENING_LOCK.md",
  "README.md",
  "packages/platform-hardening/src/vertical-isolation.ts",
  "packages/e2e-readiness/src/public-surface-safety.ts",
  "tests/hardening/vertical-isolation.test.ts",
  "scripts/audit-vertical-isolation.mjs"
];

const blocked = [
  "cards_master",
  "vault_items",
  "sports-card marketplace",
  "sports card marketplace",
  "break room",
  "collectibles trust score",
  "card data seeding"
];

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

const files = rootsToScan
  .flatMap(walk)
  .filter((file) => /\.(ts|tsx|js|mjs|json|md|sql|yml|yaml)$/.test(file))
  .filter((file) => !allowedFiles.includes(file));

const violations = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8").toLowerCase();
  for (const term of blocked) {
    if (text.includes(term.toLowerCase())) {
      violations.push(`${file} contains blocked Collectibles vertical term: ${term}`);
    }
  }
}

if (violations.length) {
  console.error("Vertical isolation violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Vertical isolation audit passed.");
