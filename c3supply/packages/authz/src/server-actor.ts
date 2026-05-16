import type { ActorRole } from "@stax/governance";
import type { AuthenticatedActor, AuthCookieConfig } from "./types";

export const defaultAuthCookieConfig: AuthCookieConfig = {
  sessionCookieName: "stax_session",
  roleHeaderName: "x-stax-role",
  actorHeaderName: "x-stax-actor-id"
};

export function parseActorRole(value: string | undefined | null): ActorRole | undefined {
  const roles: ActorRole[] = [
    "PUBLIC",
    "CUSTOMER",
    "SALES",
    "OPS",
    "ADMIN",
    "SUPER_ADMIN",
    "TECHNICIAN",
    "SERVICE_MANAGER",
    "FINANCE",
    "REPORTING"
  ];

  return roles.includes(value as ActorRole) ? (value as ActorRole) : undefined;
}

export function actorFromHeaders(
  headers: Pick<Headers, "get">,
  config: AuthCookieConfig = defaultAuthCookieConfig
): AuthenticatedActor | undefined {
  const role = parseActorRole(headers.get(config.roleHeaderName));
  const id = headers.get(config.actorHeaderName);

  if (!role || !id) return undefined;

  return {
    id,
    role,
    email: headers.get("x-stax-email") ?? undefined,
    assignedWorkOrderIds: headers.get("x-stax-assigned-work-orders")?.split(",").filter(Boolean)
  };
}

export function placeholderActor(role: ActorRole, id = "placeholder-actor"): AuthenticatedActor {
  return { id, role };
}
