import { authenticateServiceAdminRequest } from "@stax/service-interface";

test("admin auth rejects missing bearer token", async () => {
  const request = new Request("https://example.test/admin");

  await expect(authenticateServiceAdminRequest(request, {})).rejects.toThrow("Missing bearer token.");
});
