import {
  adminRoutePolicies,
  customerRoutePolicies,
  evaluateRouteAccess,
  findRoutePolicy,
  requireFinanceRole,
  requireTechnicianAssignment
} from "@stax/authz";

test("finance export route requires finance/admin role", () => {
  const policy = findRoutePolicy("/billing/simply-accounting-export/batch-1", adminRoutePolicies);

  expect(policy?.allowedRoles).toContain("FINANCE");
  expect(policy?.allowedRoles).not.toContain("TECHNICIAN");
  expect(policy?.allowedRoles).not.toContain("CUSTOMER");
});

test("customer routes require authenticated customer", () => {
  const result = evaluateRouteAccess({
    pathname: "/systems",
    policies: customerRoutePolicies
  });

  expect(result.allowed).toBe(false);
  expect(result.redirectTo).toBe("/login");
});

test("finance role guard allows finance", () => {
  expect(requireFinanceRole({ id: "finance-1", role: "FINANCE" }).allowed).toBe(true);
});

test("technician can only access assigned work order", () => {
  expect(
    requireTechnicianAssignment(
      { id: "tech-1", role: "TECHNICIAN", assignedWorkOrderIds: ["wo-1"] },
      "wo-1"
    ).allowed
  ).toBe(true);

  expect(
    requireTechnicianAssignment(
      { id: "tech-1", role: "TECHNICIAN", assignedWorkOrderIds: ["wo-1"] },
      "wo-2"
    ).allowed
  ).toBe(false);
});
