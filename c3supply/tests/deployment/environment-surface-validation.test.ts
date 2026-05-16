import { validateAuthMode, validateEnvironmentForSurface, validateRequiredStorageBucketsConfigured, validateServerOnlyKeysNotPublic, validateSimplyAccountingExportMode } from "@stax/deployment-switchboard";

test("surface env validation reports missing keys", () => {
  const result = validateEnvironmentForSurface({ env: {}, surface: "storefront", environment: "production" });
  expect(result.ready).toBe(false);
  expect(result.missingEnvKeys).toContain("NEXT_PUBLIC_SITE_NAME");
});

test("server-only public keys are warned", () => {
  expect(validateServerOnlyKeysNotPublic({ NEXT_PUBLIC_OPENAI_API_KEY: "bad" })).toContain("NEXT_PUBLIC_OPENAI_API_KEY must not be public.");
});

test("storage bucket validation catches missing keys", () => {
  expect(validateRequiredStorageBucketsConfigured({})).toContain("SERVICE_ATTACHMENTS_BUCKET");
});

test("auth mode catches production dev fallback", () => {
  expect(validateAuthMode({ DEPLOYMENT_ENVIRONMENT: "production", AUTH_DEV_HEADER_FALLBACK_ENABLED: "true" })[0]).toContain("AUTH_DEV_HEADER_FALLBACK_ENABLED");
});

test("Simply Accounting direct sync remains disabled", () => {
  expect(validateSimplyAccountingExportMode({ SIMPLY_ACCOUNTING_DIRECT_SYNC_ENABLED: "true" })[0]).toContain("direct sync");
});
