import type { SecretExposureFinding } from "./types";

export const serverOnlySecretTokens = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "SERVICE_NOTIFICATION_SHARED_SECRET"
];

export const forbiddenPublicSecretTokens = [
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_OPENAI_API_KEY",
  "NEXT_PUBLIC_SERVICE_NOTIFICATION_SHARED_SECRET"
];

export function classifySecretToken(file: string, token: string): SecretExposureFinding {
  if (forbiddenPublicSecretTokens.includes(token)) {
    return {
      file,
      token,
      severity: "CRITICAL",
      reason: "Server-only secret was exposed as a public/NEXT_PUBLIC variable."
    };
  }

  if (serverOnlySecretTokens.includes(token)) {
    const appApiRoute = file.includes("/app/api/");
    const clientLike =
      !appApiRoute &&
      (file.includes("/components/") ||
        file.endsWith(".tsx") ||
        file.includes("apps/storefront/app/") ||
        file.includes("apps/customer/app/") ||
        file.includes("apps/technician/app/"));

    return {
      file,
      token,
      severity: clientLike ? "HIGH" : "LOW",
      reason: clientLike
        ? "Server-only secret appears in an app/client-facing surface."
        : "Server-only secret reference appears in server/config/docs/test context."
    };
  }

  return {
    file,
    token,
    severity: "LOW",
    reason: "Token is not classified as a server-only secret."
  };
}

export function isCriticalSecretFinding(finding: SecretExposureFinding): boolean {
  return finding.severity === "CRITICAL" || finding.severity === "HIGH";
}
