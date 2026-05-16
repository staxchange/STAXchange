export interface PhotoUploadPolicyInput {
  workOrderId?: string;
  technicianId?: string;
  contentType: string;
  sizeBytes?: number;
}

const defaultAllowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export function validateServicePhotoUpload(input: PhotoUploadPolicyInput, options?: { maxMb?: number; allowedTypes?: string[] }): void {
  if (!input.workOrderId) throw new Error("workOrderId is required for service photo upload.");
  if (!input.technicianId) throw new Error("technicianId is required for service photo upload.");

  const allowed = options?.allowedTypes ?? defaultAllowed;
  if (!allowed.includes(input.contentType)) throw new Error("Unsupported service photo content type.");

  const maxBytes = (options?.maxMb ?? 15) * 1024 * 1024;
  if (input.sizeBytes && input.sizeBytes > maxBytes) throw new Error("Service photo is too large.");
}
