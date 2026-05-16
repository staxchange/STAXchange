import type { SupabaseClient } from "@supabase/supabase-js";
import type { Actor, ActorRole } from "@stax/governance";

export type ServiceProfileRole = "CUSTOMER" | "TECHNICIAN" | "SERVICE_MANAGER" | "OPS" | "ADMIN" | "SUPER_ADMIN";

export interface ServiceProfileDTO {
  userId: string;
  email?: string;
  role: ServiceProfileRole;
  technicianId?: string;
}

function mapServiceRoleToActorRole(role: ServiceProfileRole): ActorRole {
  if (role === "CUSTOMER") return "CUSTOMER";
  return role;
}

export function bearerTokenFromRequest(request: Request, cookieName = "sb-access-token"): string | undefined {
  const authorization = request.headers.get("authorization");
  if (authorization?.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }

  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  return match ? decodeURIComponent(match.slice(cookieName.length + 1)) : undefined;
}

export async function getServiceProfileFromRequest(
  supabase: SupabaseClient,
  request: Request,
  cookieName?: string
): Promise<ServiceProfileDTO | undefined> {
  const token = bearerTokenFromRequest(request, cookieName);

  if (!token) return undefined;

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return undefined;

  const { data, error } = await supabase
    .from("service_profiles")
    .select("user_id,email,role,technician_id")
    .eq("user_id", authData.user.id)
    .single();

  if (error || !data) return undefined;

  const row = data as {
    user_id: string;
    email: string | null;
    role: ServiceProfileRole;
    technician_id: string | null;
  };

  return {
    userId: row.user_id,
    email: row.email ?? authData.user.email ?? undefined,
    role: row.role,
    technicianId: row.technician_id ?? undefined
  };
}

export async function requireServiceActor(
  supabase: SupabaseClient,
  request: Request,
  allowedRoles: ServiceProfileRole[],
  cookieName?: string
): Promise<Actor> {
  const profile = await getServiceProfileFromRequest(supabase, request, cookieName);

  if (!profile) {
    throw new Error("Service authentication required.");
  }

  if (!allowedRoles.includes(profile.role)) {
    throw new Error(`Service role ${profile.role} is not permitted.`);
  }

  return {
    id: profile.userId,
    role: mapServiceRoleToActorRole(profile.role),
    email: profile.email
  };
}


export async function authenticateServiceAdminRequest(
  request: Request,
  env: NodeJS.ProcessEnv = process.env
): Promise<Actor> {
  const token = bearerTokenFromRequest(request, env.SUPABASE_JWT_COOKIE_NAME);
  if (!token) throw new Error("Missing bearer token.");

  const { createSupabaseServiceRoleClient } = await import("./supabase-admin-client");
  const supabase = createSupabaseServiceRoleClient(env);
  return requireServiceActor(
    supabase,
    request,
    ["SERVICE_MANAGER", "OPS", "ADMIN", "SUPER_ADMIN"],
    env.SUPABASE_JWT_COOKIE_NAME
  );
}
