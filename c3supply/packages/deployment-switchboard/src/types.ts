export type DeploymentEnvironment = "local" | "preview" | "production";

export type DeploymentSurface =
  | "storefront"
  | "admin"
  | "technician"
  | "customer"
  | "supabase"
  | "notifications"
  | "accounting-export";

export interface DeploymentEnvRequirement {
  key: string;
  requiredIn: DeploymentEnvironment[];
  public: boolean;
  description: string;
}

export interface DeploymentSurfaceConfig {
  surface: DeploymentSurface;
  appPath?: string;
  rootDirectory?: string;
  buildCommand?: string;
  requiredEnvKeys: string[];
  publicDomain?: string;
}

export interface ProductionPreflightResult {
  ready: boolean;
  missingEnvKeys: string[];
  warnings: string[];
}
