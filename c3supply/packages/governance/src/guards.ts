import type { Actor } from "./actors";
import type { Permission } from "./permissions";
import { permissionMatrix } from "./permissions";
import type { GovernanceResult } from "./results";
import { allowed, denied } from "./results";

export function requireActor(actor: Actor | undefined): GovernanceResult {
  if (!actor?.id) return denied("Actor is required.");
  return allowed();
}

export function requireRole(actor: Actor, roles: Actor["role"][]): GovernanceResult {
  return roles.includes(actor.role) ? allowed() : denied(`Role ${actor.role} is not permitted.`);
}

export function requirePermission(actor: Actor, permission: Permission): GovernanceResult {
  const permissions = permissionMatrix[actor.role] ?? [];
  return permissions.includes(permission)
    ? allowed()
    : denied(`Role ${actor.role} does not have permission ${permission}.`);
}
