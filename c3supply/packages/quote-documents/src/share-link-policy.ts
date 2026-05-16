import type { QuoteShareLinkDTO } from "./types";

export function createOpaqueQuoteToken(seed = crypto.randomUUID()): string {
  return Buffer.from(`${seed}:${Date.now()}`).toString("base64url");
}

export function canCreateShareLink(documentApproved: boolean): boolean {
  return documentApproved === true;
}

export function shareLinkIsValid(link: QuoteShareLinkDTO, now = new Date()): boolean {
  return link.documentApproved && new Date(link.expiresAt).getTime() > now.getTime();
}
