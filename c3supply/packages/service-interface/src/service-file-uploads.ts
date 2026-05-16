import type { SupabaseClient } from "@supabase/supabase-js";

export type ServiceUploadPurpose = "service-photo" | "water-test" | "work-order-document";

export interface CreateServiceUploadSignedUrlInput {
  bucket: string;
  serviceRequestId?: string;
  workOrderId?: string;
  fileName: string;
  contentType: string;
  purpose: ServiceUploadPurpose;
  expiresInSeconds?: number;
}

export interface ServiceUploadSignedUrlDTO {
  bucket: string;
  path: string;
  signedUrl: string;
  token: string;
  expiresInSeconds: number;
}

const allowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf"
]);

function safeSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function validateServiceUploadRequest(input: CreateServiceUploadSignedUrlInput): void {
  if (!input.bucket) throw new Error("Upload bucket is required.");
  if (!input.fileName) throw new Error("fileName is required.");
  if (!allowedContentTypes.has(input.contentType)) {
    throw new Error("Unsupported upload content type.");
  }
  if (!input.serviceRequestId && !input.workOrderId) {
    throw new Error("serviceRequestId or workOrderId is required.");
  }
}

export async function createServiceUploadSignedUrl(
  supabase: SupabaseClient,
  input: CreateServiceUploadSignedUrlInput
): Promise<ServiceUploadSignedUrlDTO> {
  validateServiceUploadRequest(input);

  const owner = safeSegment(input.serviceRequestId ?? input.workOrderId ?? "unknown");
  const fileName = safeSegment(input.fileName);
  const path = `${input.purpose}/${owner}/${crypto.randomUUID()}-${fileName}`;
  const expiresInSeconds = input.expiresInSeconds ?? 7200;

  const { data, error } = await supabase.storage
    .from(input.bucket)
    .createSignedUploadUrl(path, { upsert: false });

  if (error) {
    throw new Error(`createServiceUploadSignedUrl: ${error.message}`);
  }

  const recordPayload = {
    service_request_id: input.serviceRequestId ?? null,
    work_order_id: input.workOrderId ?? null,
    bucket: input.bucket,
    object_path: path,
    content_type: input.contentType,
    purpose: input.purpose,
    upload_status: "SIGNED_URL_CREATED"
  };

  await supabase.from("service_uploads").insert(recordPayload);

  return {
    bucket: input.bucket,
    path,
    signedUrl: data.signedUrl,
    token: data.token,
    expiresInSeconds
  };
}
