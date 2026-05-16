import { getRequiredSupabaseServerConfig, hasSupabaseServiceRoleConfig } from "@stax/service-interface";

test("throws when service role config is missing", () => {
  expect(() => getRequiredSupabaseServerConfig({})).toThrow("SUPABASE_URL");
});

test("detects service role config", () => {
  expect(hasSupabaseServiceRoleConfig({ SUPABASE_URL: "https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "server-only" })).toBe(true);
});
