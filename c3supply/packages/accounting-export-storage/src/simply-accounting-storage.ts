import { calculateDownloadExpiry } from "./download-policy";

export interface SimplyAccountingStorageConfig {
  bucket: string;
  signedDownloadTtlMinutes: number;
}

export interface SimplyAccountingSignedDownloadResult {
  bucket: string;
  objectPath: string;
  signedUrl: string;
  expiresAt: string;
}

interface SupabaseStorageLikeClient {
  storage: {
    from(bucket: string): {
      createSignedUrl(path: string, expiresIn: number): Promise<{
        data: { signedUrl?: string } | null;
        error: { message: string } | null;
      }>;
    };
  };
}

export function simplyAccountingStorageConfig(env: Record<string, string | undefined> = process.env): SimplyAccountingStorageConfig {
  return {
    bucket: env.SIMPLY_ACCOUNTING_EXPORT_STORAGE_BUCKET ?? "simply-accounting-export-files",
    signedDownloadTtlMinutes: Number(env.SIMPLY_ACCOUNTING_EXPORT_SIGNED_DOWNLOAD_TTL_MINUTES ?? 30)
  };
}

export async function createSimplyAccountingSignedDownload(input: {
  client: SupabaseStorageLikeClient;
  objectPath: string;
  config?: SimplyAccountingStorageConfig;
}): Promise<SimplyAccountingSignedDownloadResult> {
  const config = input.config ?? simplyAccountingStorageConfig();
  const expiresInSeconds = config.signedDownloadTtlMinutes * 60;
  const { data, error } = await input.client.storage.from(config.bucket).createSignedUrl(input.objectPath, expiresInSeconds);
  if (error) throw new Error(error.message);
  if (!data?.signedUrl) throw new Error("Signed download URL was not returned.");
  return {
    bucket: config.bucket,
    objectPath: input.objectPath,
    signedUrl: data.signedUrl,
    expiresAt: calculateDownloadExpiry({ ttlMinutes: config.signedDownloadTtlMinutes, maxTtlMinutes: 120 })
  };
}
