import { getSupabaseServerConfig } from "@stax/service-interface";

test("returns undefined when service role env is missing", () => {
  const config = getSupabaseServerConfig({});
  expect(config).toBeUndefined();
});

test("loads Supabase service config from server env", () => {
  const config = getSupabaseServerConfig({
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "service-role",
    SERVICE_ATTACHMENTS_BUCKET: "service-attachments"
  });

  expect(config?.url).toBe("https://example.supabase.co");
  expect(config?.attachmentsBucket).toBe("service-attachments");
});
