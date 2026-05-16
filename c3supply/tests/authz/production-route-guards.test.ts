import { adminRoutePolicies, evaluateRouteAccess, findRoutePolicy, technicianRoutePolicies } from "@stax/authz";

test("finance export routes require finance or admin", () => {
  const policy = findRoutePolicy("/billing/simply-accounting-export/batch-1", adminRoutePolicies);
  expect(policy?.allowedRoles).toContain("FINANCE");
  expect(policy?.allowedRoles).not.toContain("TECHNICIAN");
});

test("technician route denies unauthenticated actor", () => {
  const result = evaluateRouteAccess({ pathname: "/work-orders", policies: technicianRoutePolicies });
  expect(result.allowed).toBe(false);
});

test("admin route allows finance billing access", () => {
  const result = evaluateRouteAccess({ pathname: "/billing", policies: adminRoutePolicies, actor: { id: "finance-1", role: "FINANCE" } });
  expect(result.allowed).toBe(true);
});
