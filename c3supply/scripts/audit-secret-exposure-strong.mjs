import fs from "node:fs";
import path from "node:path";

const rootsToScan = ["apps", "packages", ".env.example"];

const criticalTokens = [
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_OPENAI_API_KEY",
  "NEXT_PUBLIC_SERVICE_NOTIFICATION_SHARED_SECRET"
];

const serverOnlyTokens = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "SERVICE_NOTIFICATION_SHARED_SECRET"
];

const allowedTokenDefinitionFiles = [
  "packages/platform-hardening/src/secret-classifier.ts",
  "tests/hardening/secret-classifier.test.ts",
  "scripts/audit-secret-exposure-strong.mjs"
];

function walk(target) {
  const full = path.join(process.cwd(), target);
  if (!fs.existsSync(full)) return [];
  if (fs.statSync(full).isFile()) return [target];

  return fs.readdirSync(full).flatMap((entry) => {
    const abs = path.join(full, entry);
    const rel = path.relative(process.cwd(), abs);
    if (rel.includes("node_modules") || rel.includes(".next") || rel.includes("dist")) return [];
    return fs.statSync(abs).isDirectory() ? walk(rel) : [rel];
  });
}

const files = rootsToScan
  .flatMap(walk)
  .filter((file) => /\.(ts|tsx|js|mjs|json|md|sql|env|example)$/.test(file) || file === ".env.example");

const violations = [];

for (const file of files) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  const allowedDefinitionFile = allowedTokenDefinitionFiles.includes(file);

  for (const token of criticalTokens) {
    if (!allowedDefinitionFile && text.includes(token)) {
      violations.push(`${file} contains forbidden public secret token ${token}`);
    }
  }

  const appApiRoute = file.includes("/app/api/");
  const clientFacing =
    !appApiRoute &&
    (file.includes("/components/") ||
      file.endsWith(".tsx") ||
      file.includes("apps/storefront/app/") ||
      file.includes("apps/customer/app/") ||
      file.includes("apps/technician/app/"));

  if (clientFacing) {
    for (const token of serverOnlyTokens) {
      if (text.includes(token)) {
        violations.push(`${file} references server-only token ${token} in client-facing surface`);
      }
    }
  }
}

if (violations.length) {
  console.error("Secret exposure violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Strong secret exposure audit passed.");
