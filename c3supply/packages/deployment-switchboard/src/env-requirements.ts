import type { DeploymentEnvRequirement } from "./types";

export const deploymentEnvRequirements: DeploymentEnvRequirement[] = [
  {
    key: "NEXT_PUBLIC_SITE_NAME",
    requiredIn: ["preview", "production"],
    public: true,
    description: "Public site name."
  },
  {
    key: "NEXT_PUBLIC_SITE_DOMAIN",
    requiredIn: ["preview", "production"],
    public: true,
    description: "Public site domain."
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    requiredIn: ["production"],
    public: true,
    description: "Public Supabase URL."
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    requiredIn: ["production"],
    public: true,
    description: "Public Supabase anon key."
  },
  {
    key: "SUPABASE_URL",
    requiredIn: ["production"],
    public: false,
    description: "Server-side Supabase URL."
  },
  {
    key: "SUPABASE_SERVICE_ROLE_KEY",
    requiredIn: ["production"],
    public: false,
    description: "Server-only Supabase service role key."
  },
  {
    key: "OPENAI_API_KEY",
    requiredIn: ["production"],
    public: false,
    description: "Server-only OpenAI API key for support/chat intake."
  },
  {
    key: "OPENAI_SUPPORT_MODEL",
    requiredIn: ["preview", "production"],
    public: false,
    description: "Support assistant model."
  },
  {
    key: "SERVICE_ATTACHMENTS_BUCKET",
    requiredIn: ["production"],
    public: false,
    description: "Supabase storage bucket for service attachments."
  },
  {
    key: "SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET",
    requiredIn: ["production"],
    public: false,
    description: "Supabase storage bucket for Simply Accounting export files."
  }
];

export function requiredEnvKeysFor(environment: "local" | "preview" | "production"): string[] {
  return deploymentEnvRequirements
    .filter((item) => item.requiredIn.includes(environment))
    .map((item) => item.key);
}

export function serverOnlyEnvKeys(): string[] {
  return deploymentEnvRequirements.filter((item) => !item.public).map((item) => item.key);
}
