import type { RoutePolicy } from "./types";

export function routeMatchesPolicy(pathname: string, policy: RoutePolicy): boolean {
  if (policy.pattern === "/") {
    return pathname === "/" || pathname === "";
  }

  return pathname === policy.pattern || pathname.startsWith(`${policy.pattern}/`);
}

export function findRoutePolicy(pathname: string, policies: RoutePolicy[]): RoutePolicy | undefined {
  return policies
    .slice()
    .sort((a, b) => b.pattern.length - a.pattern.length)
    .find((policy) => routeMatchesPolicy(pathname, policy));
}
