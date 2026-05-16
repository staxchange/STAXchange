import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "FINAL_PRODUCTION_AUDIT.md",
  "FINAL_MASTER_IMPORT_PROMPT.txt",
  "docs/deployment/PRODUCTION_ENVIRONMENT_MATRIX.md",
  "docs/deployment/VERCEL_PROJECT_ORDER.md",
  "docs/deployment/SUPABASE_FINAL_MIGRATION_ORDER.md",
  "docs/runbooks/LAUNCH_DAY_RUNBOOK.md",
  "docs/runbooks/KNOWN_BLOCKERS_AND_OPEN_ITEMS.md",
  "docs/governance/FINAL_BOUNDARY_CHECKPOINT.md",
  "docs/runbooks/FINAL_SMOKE_TEST_MATRIX.md",
  "packages/deployment-switchboard/src/index.ts",
  "packages/authz/src/index.ts",
  "packages/commands/src/index.ts",
  "apps/storefront/app/api/health/route.ts",
  "apps/storefront/app/api/readiness/route.ts"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing final master bundle files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const forbiddenPublicSecrets = [
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_OPENAI_API_KEY"
];

const envExample = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf8");
const violations = forbiddenPublicSecrets.filter((token) => envExample.includes(token));

if (violations.length) {
  console.error("Forbidden public secret keys found:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Final master bundle audit passed.");
