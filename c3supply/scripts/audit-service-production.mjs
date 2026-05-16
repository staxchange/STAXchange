import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/service-interface/src/supabase-admin-client.ts",
  "packages/service-interface/src/supabase-service-repository.ts",
  "packages/service-interface/src/supabase-audit-sink.ts",
  "packages/service-interface/src/service-file-uploads.ts",
  "packages/service-interface/src/rate-limit.ts",
  "packages/service-interface/src/multi-destination-service-notifier.ts",
  "packages/service-interface/src/service-auth.ts",
  "apps/storefront/app/api/service-uploads/create-signed-upload/route.ts",
  "apps/admin/app/api/service-queue/route.ts",
  "infra/supabase/migrations/0004_service_rls_auth_uploads_notifications.sql"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));
if (missing.length) {
  console.error("Missing production service files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const appFiles = [
  "apps/storefront/app/api/service-request/route.ts",
  "apps/storefront/app/api/service-uploads/create-signed-upload/route.ts",
  "apps/admin/app/api/service-queue/route.ts"
];

const banned = ["SUPABASE_SERVICE_ROLE_KEY=", "OPENAI_API_KEY=sk-"];
const violations = [];

for (const file of appFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of banned) {
    if (text.includes(token)) violations.push(`${file} contains literal secret pattern ${token}`);
  }
}

const serviceRequestRoute = fs.readFileSync(path.join(process.cwd(), "apps/storefront/app/api/service-request/route.ts"), "utf8");
if (!serviceRequestRoute.includes("checkInMemoryRateLimit")) {
  violations.push("service-request route is missing rate limit check");
}
if (!serviceRequestRoute.includes("createServiceCommandContextAdapters")) {
  violations.push("service-request route is missing command context adapter wiring");
}

if (violations.length) {
  console.error("Production service audit failed:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Production service interface audit passed.");
