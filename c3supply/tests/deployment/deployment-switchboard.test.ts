import {
  deploymentSurfaces,
  evaluateProductionPreflight,
  requiredEnvKeysFor,
  serverOnlyEnvKeys
} from "@stax/deployment-switchboard";

test("storefront deployment surface is configured", () => {
  const storefront = deploymentSurfaces.find((surface) => surface.surface === "storefront");

  expect(storefront?.rootDirectory).toBe("apps/storefront");
  expect(storefront?.publicDomain).toBe("dwgprocesssupply.com");
});

test("production preflight reports missing keys", () => {
  const result = evaluateProductionPreflight({}, "production");

  expect(result.ready).toBe(false);
  expect(result.missingEnvKeys.length).toBeGreaterThan(0);
});

test("production env requirements include OpenAI and Supabase service role", () => {
  const keys = requiredEnvKeysFor("production");

  expect(keys).toContain("OPENAI_API_KEY");
  expect(keys).toContain("SUPABASE_SERVICE_ROLE_KEY");
});

test("server-only keys are not public", () => {
  expect(serverOnlyEnvKeys()).toContain("SUPABASE_SERVICE_ROLE_KEY");
  expect(serverOnlyEnvKeys()).toContain("OPENAI_API_KEY");
});
