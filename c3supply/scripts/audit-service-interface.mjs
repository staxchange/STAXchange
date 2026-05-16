import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "packages/service-interface/src/types.ts",
  "packages/service-interface/src/request-sanitizer.ts",
  "packages/service-interface/src/intake-rules.ts",
  "packages/service-interface/src/service-sla.ts",
  "packages/service-interface/src/checklist-templates.ts",
  "packages/service-interface/src/api-contracts.ts",
  "packages/service-interface/src/index.ts",
  "packages/service-interface/src/repository-contracts.ts",
  "packages/service-interface/src/in-memory-service-repository.ts",
  "packages/service-interface/src/notification-contracts.ts",
  "packages/service-interface/src/webhook-service-notifier.ts",
  "packages/service-interface/src/service-command-context.ts",
  "packages/service-interface/src/supabase-admin-client.ts",
  "packages/service-interface/src/supabase-service-repository.ts",
  "packages/service-interface/src/supabase-audit-sink.ts",
  "packages/service-interface/src/service-file-uploads.ts",
  "packages/service-interface/src/rate-limit.ts",
  "packages/service-interface/src/multi-destination-service-notifier.ts",
  "packages/service-interface/src/service-auth.ts",
  "packages/commands/src/service/service-adapters.ts",
  "packages/commands/src/service/CreateServiceRequestCommand.ts",
  "packages/commands/src/service/TriageServiceRequestCommand.ts",
  "packages/commands/src/service/CreateServiceWorkOrderCommand.ts",
  "packages/commands/src/service/ScheduleServiceVisitCommand.ts",
  "packages/commands/src/service/AssignServiceTechnicianCommand.ts",
  "packages/commands/src/service/CompleteServiceVisitCommand.ts",
  "packages/commands/src/service/EscalateEmergencyServiceCommand.ts",
  "apps/storefront/app/service/page.tsx",
  "apps/storefront/app/service/ServiceRequestForm.tsx",
  "apps/storefront/app/api/service-request/route.ts",
  "apps/storefront/app/api/service-uploads/create-signed-upload/route.ts",
  "apps/admin/app/service/page.tsx",
  "apps/admin/app/api/service-queue/route.ts",
  "infra/supabase/migrations/0003_treatment_service_interface.sql",
  "infra/supabase/migrations/0004_service_rls_auth_uploads_notifications.sql",
  "docs/workflows/TREATMENT_SYSTEM_SERVICE.md",
  "docs/architecture/SERVICE_INTERFACE_BOUNDARIES.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(process.cwd(), file)));

if (missing.length) {
  console.error("Missing service interface files:");
  console.error(missing.join("\n"));
  process.exit(1);
}

const appFiles = [
  "apps/storefront/app/api/service-request/route.ts",
  "apps/storefront/app/api/service-uploads/create-signed-upload/route.ts",
  "apps/storefront/app/service/ServiceRequestForm.tsx",
  "apps/admin/app/service/page.tsx"
];

const bannedTokens = ["stripe", "SUPABASE_SERVICE_ROLE_KEY=", "OPENAI_API_KEY=sk-"];
const violations = [];

for (const file of appFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  for (const token of bannedTokens) {
    if (text.includes(token)) violations.push(`${file} contains banned token ${token}`);
  }
}

const serviceRoute = fs.readFileSync(path.join(process.cwd(), "apps/storefront/app/api/service-request/route.ts"), "utf8");
if (!serviceRoute.includes("createServiceCommandContextAdapters")) {
  violations.push("Service request route is not using service command context adapters.");
}
if (!serviceRoute.includes("checkInMemoryRateLimit")) {
  violations.push("Service request route is not rate limited.");
}

const commandFiles = [
  "packages/commands/src/service/CreateServiceRequestCommand.ts",
  "packages/commands/src/service/TriageServiceRequestCommand.ts",
  "packages/commands/src/service/CreateServiceWorkOrderCommand.ts",
  "packages/commands/src/service/ScheduleServiceVisitCommand.ts",
  "packages/commands/src/service/AssignServiceTechnicianCommand.ts",
  "packages/commands/src/service/CompleteServiceVisitCommand.ts",
  "packages/commands/src/service/EscalateEmergencyServiceCommand.ts"
];

for (const file of commandFiles) {
  const text = fs.readFileSync(path.join(process.cwd(), file), "utf8");
  if (!text.includes("serviceRepositoryFromContext")) {
    violations.push(`${file} does not use serviceRepositoryFromContext.`);
  }
}

if (violations.length) {
  console.error("Service boundary violations:");
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Treatment service interface audit passed.");
