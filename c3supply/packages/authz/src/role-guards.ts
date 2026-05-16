import type { ActorRole } from "@stax/governance";
import type { AuthenticatedActor, RouteGuardResult, RoutePolicy } from "./types";

export function roleAllowed(actorRole: ActorRole, allowedRoles: ActorRole[]): boolean {
  return allowedRoles.includes(actorRole);
}

export function requireRouteRole(
  actor: AuthenticatedActor | undefined,
  policy: RoutePolicy,
  loginPath = "/login"
): RouteGuardResult {
  if (!actor) {
    return {
      allowed: false,
      reason: "Authentication required.",
      redirectTo: loginPath
    };
  }

  if (!roleAllowed(actor.role, policy.allowedRoles)) {
    return {
      allowed: false,
      reason: `Role ${actor.role} is not allowed for ${policy.pattern}.`,
      redirectTo: "/unauthorized"
    };
  }

  return { allowed: true };
}

export function requireFinanceRole(actor: AuthenticatedActor | undefined): RouteGuardResult {
  if (!actor) return { allowed: false, reason: "Authentication required.", redirectTo: "/login" };

  return roleAllowed(actor.role, ["FINANCE", "ADMIN", "SUPER_ADMIN"])
    ? { allowed: true }
    : { allowed: false, reason: "Finance role required.", redirectTo: "/unauthorized" };
}

export function requireTechnicianAssignment(
  actor: AuthenticatedActor,
  workOrderId: string
): RouteGuardResult {
  if (roleAllowed(actor.role, ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"])) {
    return { allowed: true };
  }

  if (actor.role !== "TECHNICIAN") {
    return {
      allowed: false,
      reason: "Technician or manager role required.",
      redirectTo: "/unauthorized"
    };
  }

  return actor.assignedWorkOrderIds?.includes(workOrderId)
    ? { allowed: true }
    : {
        allowed: false,
        reason: "Technician can only access assigned work orders.",
        redirectTo: "/unauthorized"
      };
}
