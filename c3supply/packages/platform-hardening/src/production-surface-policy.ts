import type { ProductionSurfaceRisk } from "./types";

export function productionSurfaceRisk(surface: string): ProductionSurfaceRisk {
  if (surface === "storefront") {
    return {
      surface,
      risk: "LOW",
      reason: "Public storefront is intended to deploy first after smoke tests."
    };
  }

  if (surface === "admin" || surface === "technician" || surface === "customer") {
    return {
      surface,
      risk: "HIGH",
      reason: "Internal/customer portals require validated auth guards and env setup before public exposure."
    };
  }

  return {
    surface,
    risk: "MEDIUM",
    reason: "Unknown surface requires manual deployment review."
  };
}

export function shouldDeploySurfaceBeforeAuthValidation(surface: string): boolean {
  return surface === "storefront";
}
