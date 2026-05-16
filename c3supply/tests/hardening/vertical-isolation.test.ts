import {
  activeVertical,
  evaluateVerticalIsolation,
  shouldDeploySurfaceBeforeAuthValidation,
  productionSurfaceRisk
} from "@stax/platform-hardening";

test("active vertical is DWG commerce service", () => {
  expect(activeVertical).toBe("dwg-commerce-service");
});

test("collectibles terms are blocked in active implementation text", () => {
  const result = evaluateVerticalIsolation("this code tries to use cards_master");

  expect(result.allowed).toBe(false);
  expect(result.blockedTerms).toContain("cards_master");
});

test("DWG ecommerce terms are allowed", () => {
  const result = evaluateVerticalIsolation("DWG service request and Simply Accounting export prep");

  expect(result.allowed).toBe(true);
});

test("only storefront should deploy before auth validation", () => {
  expect(shouldDeploySurfaceBeforeAuthValidation("storefront")).toBe(true);
  expect(shouldDeploySurfaceBeforeAuthValidation("admin")).toBe(false);
  expect(productionSurfaceRisk("admin").risk).toBe("HIGH");
});
