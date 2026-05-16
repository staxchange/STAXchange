export interface GovernanceResult {
  allowed: boolean;
  reason?: string;
}

export const allowed = (): GovernanceResult => ({ allowed: true });

export const denied = (reason: string): GovernanceResult => ({
  allowed: false,
  reason
});
