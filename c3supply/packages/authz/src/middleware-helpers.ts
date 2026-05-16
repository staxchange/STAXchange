import type { AuthenticatedActor, RoutePolicy } from "./types";
import { findRoutePolicy } from "./route-matcher";
import { requireRouteRole } from "./role-guards";

export function evaluateRouteAccess(input: {
  pathname: string;
  actor?: AuthenticatedActor;
  policies: RoutePolicy[];
  loginPath?: string;
}) {
  const policy = findRoutePolicy(input.pathname, input.policies);

  if (!policy) {
    return { allowed: true };
  }

  return requireRouteRole(input.actor, policy, input.loginPath);
}
