import type { DeploymentSurfaceConfig } from "./types";

export const deploymentSurfaces: DeploymentSurfaceConfig[] = [
  {
    surface: "storefront",
    appPath: "apps/storefront",
    rootDirectory: "apps/storefront",
    buildCommand: "npm run build",
    requiredEnvKeys: [
      "NEXT_PUBLIC_SITE_NAME",
      "NEXT_PUBLIC_SITE_DOMAIN",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "OPENAI_API_KEY",
      "OPENAI_SUPPORT_MODEL"
    ],
    publicDomain: "dwgprocesssupply.com"
  },
  {
    surface: "admin",
    appPath: "apps/admin",
    rootDirectory: "apps/admin",
    buildCommand: "npm run build",
    requiredEnvKeys: [
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET"
    ],
    publicDomain: "admin.dwgprocesssupply.com"
  },
  {
    surface: "technician",
    appPath: "apps/technician",
    rootDirectory: "apps/technician",
    buildCommand: "npm run build",
    requiredEnvKeys: [
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SERVICE_ATTACHMENTS_BUCKET"
    ],
    publicDomain: "tech.dwgprocesssupply.com"
  },
  {
    surface: "customer",
    appPath: "apps/customer",
    rootDirectory: "apps/customer",
    buildCommand: "npm run build",
    requiredEnvKeys: [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ],
    publicDomain: "portal.dwgprocesssupply.com"
  }
];
