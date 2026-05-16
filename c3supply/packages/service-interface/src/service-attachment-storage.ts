export interface ServiceAttachmentStorageConfig {
  bucket: string;
  signedUploadTtlSeconds: number;
}

export interface ServiceAttachmentSignedUpload {
  bucket: string;
  objectPath: string;
  uploadUrl: string;
  token?: string;
  expiresInSeconds: number;
}

interface SupabaseStorageLikeClient {
  storage: {
    from(bucket: string): {
      createSignedUploadUrl(path: string, options?: unknown): Promise<{
        data: { signedUrl?: string; path?: string; token?: string } | null;
        error: { message: string } | null;
      }>;
    };
  };
}

export function serviceAttachmentStorageConfig(env: Record<string, string | undefined> = process.env): ServiceAttachmentStorageConfig {
  return {
    bucket: env.SERVICE_ATTACHMENTS_BUCKET ?? "service-attachments",
    signedUploadTtlSeconds: Number(env.SERVICE_ATTACHMENT_UPLOAD_TTL_SECONDS ?? 7200)
  };
}

export function serviceAttachmentObjectPath(input: {
  workOrderId?: string;
  serviceRequestId?: string;
  fileName: string;
}): string {
  const owner = input.workOrderId ? `work-orders/${input.workOrderId}` : `service-requests/${input.serviceRequestId ?? "unassigned"}`;
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${owner}/${Date.now()}-${safeName}`;
}

export async function createServiceAttachmentSignedUpload(input: {
  client: SupabaseStorageLikeClient;
  objectPath: string;
  config?: ServiceAttachmentStorageConfig;
}): Promise<ServiceAttachmentSignedUpload> {
  const config = input.config ?? serviceAttachmentStorageConfig();
  const { data, error } = await input.client.storage.from(config.bucket).createSignedUploadUrl(input.objectPath);
  if (error) throw new Error(error.message);
  if (!data?.signedUrl) throw new Error("Signed upload URL was not returned.");
  return {
    bucket: config.bucket,
    objectPath: data.path ?? input.objectPath,
    uploadUrl: data.signedUrl,
    token: data.token,
    expiresInSeconds: config.signedUploadTtlSeconds
  };
}
