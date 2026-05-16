import type { ActorRole } from "@stax/governance";

export type AppSurface = "storefront" | "customer" | "admin" | "technician";

export interface AuthenticatedActor {
  id: string;
  role: ActorRole;
  email?: string;
  assignedWorkOrderIds?: string[];
}

export interface RouteGuardResult {
  allowed: boolean;
  reason?: string;
  redirectTo?: string;
}

export interface RoutePolicy {
  pattern: string;
  allowedRoles: ActorRole[];
  surface: AppSurface;
  description: string;
}

export interface AuthCookieConfig {
  sessionCookieName: string;
  roleHeaderName: string;
  actorHeaderName: string;
}
