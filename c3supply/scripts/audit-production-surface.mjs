import fs from "node:fs";
import path from "node:path";

const required = [
  "docs/governance/MOM_DWG_VERTICAL_LOCK.md",
  "docs/governance/FINAL_BOUNDARY_CHECKPOINT.md",
  "docs/deployment/VERCEL_PROJECT_ORDER.md",
  "docs/deployment/PRODUCTION_ENVIRONMENT_MATRIX.md",
  "docs/runbooks/LAUNCH_DAY_RUNBOOK.md",
  "apps/storefront/app/api/health/route.ts",
  "apps/storefront/app/api/readiness/route.ts",
  "infra/vercel/PROJECT_MATRIX.md"
];

const missing = required.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Production surface audit missing files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const projectMatrix = fs.readFileSync(path.join(process.cwd(), "infra/vercel/PROJECT_MATRIX.md"), "utf8");
const requiredSurfaces = [
  "apps/storefront",
  "apps/admin",
  "apps/technician",
  "apps/customer"
];

const missingSurfaces = requiredSurfaces.filter((surface) => !projectMatrix.includes(surface));

if (missingSurfaces.length) {
  console.error("Vercel project matrix missing surfaces:");
  console.error(missingSurfaces.join("\n"));
  process.exit(1);
}

console.log("Production surface audit passed.");
