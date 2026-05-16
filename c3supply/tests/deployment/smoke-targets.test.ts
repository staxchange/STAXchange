import { apiSmokeTargets, storefrontSmokeTargets } from "@stax/deployment-switchboard";

test("storefront smoke targets include legal and health routes", () => {
  const paths = storefrontSmokeTargets.map((target) => target.path);

  expect(paths).toContain("/privacy");
  expect(paths).toContain("/terms");
  expect(paths).toContain("/api/health");
});

test("API smoke targets include service routes", () => {
  const paths = apiSmokeTargets.map((target) => target.path);

  expect(paths).toContain("/api/service-request");
  expect(paths).toContain("/api/service-system-lookup");
});
