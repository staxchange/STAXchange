import type { ActorRole } from "@stax/governance";
import { actorFromHeaders, parseActorRole } from "./server-actor";
import type { AuthenticatedActor } from "./types";

export interface SupabaseSessionUser {
  id: string;
  email?: string;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
}

export interface SupabaseSessionContext {
  user?: SupabaseSessionUser | null;
}

export interface CustomerProfileSummary {
  id: string;
  email: string;
  name?: string;
  company?: string;
}

export interface AuthRoleAssignmentRepository {
  getActiveRoleForUser(userId: string): Promise<ActorRole | undefined>;
  listAssignedWorkOrderIdsForUser(userId: string): Promise<string[]>;
  getCustomerProfileForUser(userId: string): Promise<CustomerProfileSummary | undefined>;
}

export interface ResolveActorFromSupabaseSessionInput {
  session?: SupabaseSessionContext | null;
  repository?: Partial<AuthRoleAssignmentRepository>;
}

export function authDevHeaderFallbackEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.AUTH_DEV_HEADER_FALLBACK_ENABLED === "true";
}

function roleFromUserMetadata(user: SupabaseSessionUser): ActorRole | undefined {
  const appRole = parseActorRole(String(user.app_metadata?.stax_role ?? user.app_metadata?.role ?? ""));
  const userRole = parseActorRole(String(user.user_metadata?.stax_role ?? user.user_metadata?.role ?? ""));
  return appRole ?? userRole;
}

export async function resolveActorRole(input: {
  user: SupabaseSessionUser;
  repository?: Partial<AuthRoleAssignmentRepository>;
}): Promise<ActorRole | undefined> {
  const repoRole = await input.repository?.getActiveRoleForUser?.(input.user.id);
  return repoRole ?? roleFromUserMetadata(input.user);
}

export async function resolveTechnicianAssignments(input: {
  user: SupabaseSessionUser;
  repository?: Partial<AuthRoleAssignmentRepository>;
}): Promise<string[]> {
  return (await input.repository?.listAssignedWorkOrderIdsForUser?.(input.user.id)) ?? [];
}

export async function resolveCustomerProfile(input: {
  user: SupabaseSessionUser;
  repository?: Partial<AuthRoleAssignmentRepository>;
}): Promise<CustomerProfileSummary | undefined> {
  return input.repository?.getCustomerProfileForUser?.(input.user.id);
}

export async function resolveActorFromSupabaseSession(
  input: ResolveActorFromSupabaseSessionInput
): Promise<AuthenticatedActor | undefined> {
  const user = input.session?.user;
  if (!user?.id) return undefined;

  const role = await resolveActorRole({ user, repository: input.repository });
  if (!role) return undefined;

  const [assignedWorkOrderIds, customerProfile] = await Promise.all([
    resolveTechnicianAssignments({ user, repository: input.repository }),
    resolveCustomerProfile({ user, repository: input.repository })
  ]);

  return {
    id: user.id,
    role,
    email: customerProfile?.email ?? user.email,
    assignedWorkOrderIds
  };
}

export async function resolveActorFromRequestContext(input: {
  headers: Pick<Headers, "get">;
  env?: Record<string, string | undefined>;
  session?: SupabaseSessionContext | null;
  repository?: Partial<AuthRoleAssignmentRepository>;
}): Promise<AuthenticatedActor | undefined> {
  const sessionActor = await resolveActorFromSupabaseSession({
    session: input.session,
    repository: input.repository
  });

  if (sessionActor) return sessionActor;

  if (authDevHeaderFallbackEnabled(input.env)) {
    return actorFromHeaders(input.headers);
  }

  return undefined;
}
