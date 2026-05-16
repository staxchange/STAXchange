import type { DeploymentEnvironment, ProductionPreflightResult } from "./types";
import { requiredEnvKeysFor, serverOnlyEnvKeys } from "./env-requirements";

export function evaluateProductionPreflight(
  env: Record<string, string | undefined>,
  environment: DeploymentEnvironment = "production"
): ProductionPreflightResult {
  const required = requiredEnvKeysFor(environment);
  const missingEnvKeys = required.filter((key) => !env[key]);
  const warnings: string[] = [];

  for (const key of serverOnlyEnvKeys()) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      warnings.push(`Server-only key ${key} is incorrectly public.`);
    }
  }

  for (const key of Object.keys(env)) {
    if (key.includes("SERVICE_ROLE") && key.startsWith("NEXT_PUBLIC_")) {
      warnings.push(`${key} must not be public.`);
    }

    if (key.includes("OPENAI") && key.startsWith("NEXT_PUBLIC_")) {
      warnings.push(`${key} must not be public.`);
    }
  }

  return {
    ready: missingEnvKeys.length === 0 && warnings.length === 0,
    missingEnvKeys,
    warnings
  };
}
