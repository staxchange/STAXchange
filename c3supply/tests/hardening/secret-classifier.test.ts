import { classifySecretToken, isCriticalSecretFinding } from "@stax/platform-hardening";

test("public service role token is critical", () => {
  const finding = classifySecretToken(".env.example", "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");

  expect(finding.severity).toBe("CRITICAL");
  expect(isCriticalSecretFinding(finding)).toBe(true);
});

test("server-only token in server context is low", () => {
  const finding = classifySecretToken("apps/storefront/app/api/readiness/route.ts", "SUPABASE_SERVICE_ROLE_KEY");

  expect(finding.severity).toBe("LOW");
});

test("server-only token in component context is high", () => {
  const finding = classifySecretToken("apps/storefront/components/Foo.tsx", "OPENAI_API_KEY");

  expect(finding.severity).toBe("HIGH");
});
