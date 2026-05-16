const requiredProductionEnvKeys = [
  "NEXT_PUBLIC_SITE_NAME",
  "NEXT_PUBLIC_SITE_DOMAIN",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "OPENAI_SUPPORT_MODEL",
  "SERVICE_ATTACHMENTS_BUCKET",
  "SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET"
];

const forbiddenPublicServerKeys = [
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_OPENAI_API_KEY"
];

const missingEnvKeys = requiredProductionEnvKeys.filter((key) => !process.env[key]);
const warnings = forbiddenPublicServerKeys.filter((key) => process.env[key]).map((key) => `${key} must not be public.`);

if (process.env.AUTH_DEV_HEADER_FALLBACK_ENABLED === "true" && process.env.DEPLOYMENT_ENVIRONMENT === "production") {
  warnings.push("AUTH_DEV_HEADER_FALLBACK_ENABLED must be false in production.");
}

if (process.env.SIMPLY_ACCOUNTING_DIRECT_SYNC_ENABLED === "true") {
  warnings.push("SIMPLY_ACCOUNTING_DIRECT_SYNC_ENABLED must remain false.");
}

const result = { ready: missingEnvKeys.length === 0 && warnings.length === 0, missingEnvKeys, warnings };
console.log(JSON.stringify(result, null, 2));
if (!result.ready) process.exit(1);
