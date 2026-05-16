export type PlatformVertical = "dwg-commerce-service" | "collectibles" | "unknown";

export interface VerticalIsolationResult {
  allowed: boolean;
  activeVertical: PlatformVertical;
  blockedTerms: string[];
  reason: string;
}

export interface SecretExposureFinding {
  file: string;
  token: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
}

export interface ProductionSurfaceRisk {
  surface: string;
  risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reason: string;
}
