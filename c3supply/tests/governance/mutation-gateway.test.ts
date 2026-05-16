import { permissionMatrix } from "@stax/governance";

test("public actors can only create quote requests", () => {
  expect(permissionMatrix.PUBLIC).toContain("quotes.create");
  expect(permissionMatrix.PUBLIC).toContain("support.ticket.create");
});

test("super admin has protected workflow permissions", () => {
  expect(permissionMatrix.SUPER_ADMIN).toContain("catalog.publish");
  expect(permissionMatrix.SUPER_ADMIN).toContain("pricing.approve");
  expect(permissionMatrix.SUPER_ADMIN).toContain("ops.sage_export");
});
