import {
  authDevHeaderFallbackEnabled,
  resolveActorFromRequestContext,
  resolveActorFromSupabaseSession,
  resolveActorRole,
  resolveCustomerProfile,
  resolveTechnicianAssignments
} from "@stax/authz";

const user = { id: "user-1", email: "user@example.com", app_metadata: { role: "TECHNICIAN" } };

const repository = {
  async getActiveRoleForUser() { return "TECHNICIAN" as const; },
  async listAssignedWorkOrderIdsForUser() { return ["wo-1", "wo-2"]; },
  async getCustomerProfileForUser() { return { id: "customer-1", email: "customer@example.com" }; }
};

test("rejects missing session", async () => {
  await expect(resolveActorFromSupabaseSession({ session: null })).resolves.toBeUndefined();
});

test("resolves known role", async () => {
  await expect(resolveActorRole({ user, repository })).resolves.toBe("TECHNICIAN");
});

test("technician assignments are included", async () => {
  await expect(resolveTechnicianAssignments({ user, repository })).resolves.toContain("wo-1");
});

test("customer profile is included", async () => {
  await expect(resolveCustomerProfile({ user, repository })).resolves.toEqual({ id: "customer-1", email: "customer@example.com" });
});

test("dev header fallback is disabled unless env flag is true", async () => {
  const headers = new Headers({ "x-stax-role": "ADMIN", "x-stax-actor-id": "admin-1" });
  expect(authDevHeaderFallbackEnabled({ AUTH_DEV_HEADER_FALLBACK_ENABLED: "false" })).toBe(false);
  await expect(resolveActorFromRequestContext({ headers, env: { AUTH_DEV_HEADER_FALLBACK_ENABLED: "false" } })).resolves.toBeUndefined();
  await expect(resolveActorFromRequestContext({ headers, env: { AUTH_DEV_HEADER_FALLBACK_ENABLED: "true" } })).resolves.toEqual({ id: "admin-1", role: "ADMIN", email: undefined, assignedWorkOrderIds: undefined });
});
