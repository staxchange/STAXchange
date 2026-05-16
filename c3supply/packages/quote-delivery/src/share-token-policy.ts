import type { QuoteShareTokenDTO } from "./types";

export function createQuoteShareToken(input: { id: string; quoteDeliveryId: string; tokenHash: string; ttlMinutes?: number; now?: Date }): QuoteShareTokenDTO {
  const now = input.now ?? new Date();
  const ttl = input.ttlMinutes ?? 60 * 24 * 14;
  return {
    id: input.id,
    quoteDeliveryId: input.quoteDeliveryId,
    tokenHash: input.tokenHash,
    expiresAt: new Date(now.getTime() + ttl * 60_000).toISOString(),
    createdAt: now.toISOString()
  };
}

export function shareTokenIsValid(token: Pick<QuoteShareTokenDTO, "expiresAt">, now = new Date()): boolean {
  return new Date(token.expiresAt).getTime() > now.getTime();
}

export function expiredTokenBlocksAcceptance(token: Pick<QuoteShareTokenDTO, "expiresAt">, now = new Date()): boolean {
  return !shareTokenIsValid(token, now);
}
