import type { CommerceQuoteDraftDTO } from "./types";

export function quoteRequiresHumanReview(): true { return true; }
export function canApproveQuote(quote: Pick<CommerceQuoteDraftDTO, "status" | "reviewStatus">): boolean { return quote.status === "HUMAN_REVIEW_REQUIRED" && quote.reviewStatus === "HUMAN_REVIEW_REQUIRED"; }
export function canSendQuote(quote: Pick<CommerceQuoteDraftDTO, "status" | "reviewStatus">): boolean { return quote.status === "QUOTE_APPROVED" && quote.reviewStatus === "APPROVED"; }
export function canAcceptQuote(status: string): boolean { return status === "QUOTE_SENT"; }
export function quoteSubtotalCents(quote: Pick<CommerceQuoteDraftDTO, "lines">): number { return quote.lines.reduce((t, l) => t + (l.unitPriceCents ?? 0) * l.quantity, 0); }
