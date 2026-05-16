export interface DownloadExpiryPolicy {
  ttlMinutes: number;
  maxTtlMinutes: number;
}

export const defaultDownloadExpiryPolicy: DownloadExpiryPolicy = {
  ttlMinutes: 30,
  maxTtlMinutes: 120
};

export function calculateDownloadExpiry(
  policy: DownloadExpiryPolicy = defaultDownloadExpiryPolicy,
  now = new Date()
): string {
  const ttl = Math.min(policy.ttlMinutes, policy.maxTtlMinutes);
  return new Date(now.getTime() + ttl * 60_000).toISOString();
}

export function financeRoleCanApproveDownload(role: string): boolean {
  return role === "FINANCE" || role === "ADMIN" || role === "SUPER_ADMIN";
}
