import type { DeploymentEnvironment, DeploymentSurface, ProductionPreflightResult } from "./types";
import { deploymentSurfaces } from "./surface-config";
import { evaluateProductionPreflight } from "./preflight";

export function validateEnvironmentForSurface(input: {
  env: Record<string, string | undefined>;
  surface: DeploymentSurface;
  environment?: DeploymentEnvironment;
}): ProductionPreflightResult {
  const surface = deploymentSurfaces.find((candidate) => candidate.surface === input.surface);
  const required = surface?.requiredEnvKeys ?? [];
  const missingEnvKeys = required.filter((key) => !input.env[key]);
  const warnings = validateServerOnlyKeysNotPublic(input.env);
  return { ready: missingEnvKeys.length === 0 && warnings.length === 0, missingEnvKeys, warnings };
}

export function validateServerOnlyKeysNotPublic(env: Record<string, string | undefined>): string[] {
  const warnings: string[] = [];
  for (const key of Object.keys(env)) {
    if (key.startsWith("NEXT_PUBLIC_") && (key.includes("SERVICE_ROLE") || key.includes("OPENAI"))) {
      warnings.push(`${key} must not be public.`);
    }
  }
  return warnings;
}

export function validateRequiredStorageBucketsConfigured(env: Record<string, string | undefined>): string[] {
  return ["SERVICE_ATTACHMENTS_BUCKET", "SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET"].filter((key) => !env[key]);
}

export function validateAuthMode(env: Record<string, string | undefined>): string[] {
  const warnings: string[] = [];
  if (env.AUTH_DEV_HEADER_FALLBACK_ENABLED === "true" && env.DEPLOYMENT_ENVIRONMENT === "production") {
    warnings.push("AUTH_DEV_HEADER_FALLBACK_ENABLED must be false in production.");
  }
  if (!env.AUTH_PRODUCTION_PROVIDER && env.DEPLOYMENT_ENVIRONMENT === "production") {
    warnings.push("AUTH_PRODUCTION_PROVIDER should be configured in production.");
  }
  return warnings;
}

export function validateSimplyAccountingExportMode(env: Record<string, string | undefined>): string[] {
  const warnings: string[] = [];
  if (env.SIMPLY_ACCOUNTING_DIRECT_SYNC_ENABLED === "true") {
    warnings.push("Simply Accounting direct sync must remain disabled.");
  }
  return warnings;
}

export function evaluateProductionIntegrationPreflight(env: Record<string, string | undefined>): ProductionPreflightResult {
  const base = evaluateProductionPreflight(env, "production");
  const warnings = [
    ...base.warnings,
    ...validateServerOnlyKeysNotPublic(env),
    ...validateAuthMode(env),
    ...validateSimplyAccountingExportMode(env)
  ];
  const missingEnvKeys = [...base.missingEnvKeys, ...validateRequiredStorageBucketsConfigured(env)].filter(
    (value, index, array) => array.indexOf(value) === index
  );
  return { ready: missingEnvKeys.length === 0 && warnings.length === 0, missingEnvKeys, warnings };
}
