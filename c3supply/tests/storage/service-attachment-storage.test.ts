import { createServiceAttachmentSignedUpload, serviceAttachmentObjectPath, serviceAttachmentStorageConfig } from "@stax/service-interface";

test("service attachment path is sanitized", () => {
  expect(serviceAttachmentObjectPath({ workOrderId: "wo-1", fileName: "bad name.pdf" })).toContain("bad-name.pdf");
});

test("creates signed upload target", async () => {
  const client = { storage: { from: () => ({ createSignedUploadUrl: async (path: string) => ({ data: { signedUrl: "https://upload", path, token: "token" }, error: null }) }) } };
  const result = await createServiceAttachmentSignedUpload({ client, objectPath: "work-orders/wo-1/file.pdf", config: serviceAttachmentStorageConfig({ SERVICE_ATTACHMENTS_BUCKET: "service-attachments" }) });
  expect(result.uploadUrl).toBe("https://upload");
});
