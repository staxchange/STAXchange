import { rolePathRules } from "@stax/e2e-readiness";

test("public and customer cannot access supplier cost/accounting export", () => {
  expect(rolePathRules("PUBLIC").forbiddenAreas).toContain("supplier cost");
  expect(rolePathRules("CUSTOMER").forbiddenAreas).toContain("accounting export trigger");
});

test("finance controls invoice/accounting handoff", () => {
  expect(rolePathRules("FINANCE").allowedAreas).toContain("accounting handoff");
});
