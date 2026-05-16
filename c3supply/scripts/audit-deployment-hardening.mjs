import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/deployment-switchboard/src/index.ts",
  "apps/storefront/app/api/health/route.ts",
  "apps/storefront/app/api/readiness/route.ts",
  "apps/admin/app/api/health/route.ts",
  "apps/technician/app/api/health/route.ts",
  "apps/customer/app/api/health/route.ts",
  "infra/vercel/PROJECT_MATRIX.md",
  "docs/deployment/SUPABASE_MIGRATION_RUNBOOK.md",
  "docs/deployment/DOMAIN_DNS_CHECKLIST.md",
  "docs/runbooks/PRODUCTION_SMOKE_TESTS.md",
  "docs/runbooks/RELEASE_CHECKLIST.md",
  "docs/runbooks/ROLLBACK_CHECKLIST.md",
  "docs/runbooks/POST_LAUNCH_MONITORING.md",
  "scripts/preflight-production.mjs",
  "scripts/smoke-storefront.mjs",
  "scripts/smoke-api-routes.mjs",
  ".github/workflows/production-readiness.yml",
  "scripts/smoke-admin.mjs",
  "scripts/smoke-customer.mjs",
  "scripts/smoke-technician.mjs",
  "packages/deployment-switchboard/src/environment-validation.ts",
  "docs/deployment/PRODUCTION_INTEGRATION_PHASE_1.md",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing deployment hardening files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const envExample = fs.readFileSync(path.join(process.cwd(), ".env.example"), "utf8");
const requiredEnvExampleKeys = [
  "NEXT_PUBLIC_SITE_DOMAIN",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "SERVICE_ATTACHMENTS_BUCKET",
  "SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET"
];

const missingEnv = requiredEnvExampleKeys.filter((key) => !envExample.includes(key));

if (missingEnv.length) {
  console.error("Missing .env.example keys:");
  console.error(missingEnv.join("\n"));
  process.exit(1);
}

console.log("Deployment hardening audit passed.");
