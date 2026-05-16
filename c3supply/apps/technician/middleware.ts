import { NextResponse, type NextRequest } from "next/server";
import { technicianRoutePolicies, evaluateRouteAccess, resolveActorFromRequestContext } from "@stax/authz";

export async function middleware(request: NextRequest) {
  const actor = await resolveActorFromRequestContext({
    headers: request.headers,
    env: process.env
  });

  const result = evaluateRouteAccess({
    pathname: request.nextUrl.pathname,
    actor,
    policies: technicianRoutePolicies,
    loginPath: "/login"
  });

  if (!result.allowed) {
    const url = request.nextUrl.clone();
    url.pathname = result.redirectTo ?? "/unauthorized";
    url.searchParams.set("reason", result.reason ?? "not_allowed");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api/health|api/auth/whoami|api/customer-session|api/technician-session).*)"]
};
