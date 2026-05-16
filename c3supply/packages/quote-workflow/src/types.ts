export type CommerceQuoteStatus = "QUOTE_REQUESTED" | "QUOTE_DRAFTED" | "HUMAN_REVIEW_REQUIRED" | "QUOTE_REVISION_REQUIRED" | "QUOTE_APPROVED" | "QUOTE_SENT" | "QUOTE_ACCEPTED" | "DECLINED";
export type QuoteReviewStatus = "NOT_SUBMITTED" | "HUMAN_REVIEW_REQUIRED" | "APPROVED" | "REVISION_REQUIRED";
export interface CommerceQuoteLineDTO { id: string; quoteId: string; productId: string; description: string; quantity: number; unitPriceCents?: number; quoteRequired: boolean; }
export interface CommerceQuoteRequestDTO { id: string; cartId?: string; customerName: string; customerEmail: string; status: "QUOTE_REQUESTED"; humanReviewRequired: true; lines: CommerceQuoteLineDTO[]; createdAt: string; }
export interface CommerceQuoteDraftDTO { id: string; requestId: string; status: CommerceQuoteStatus; reviewStatus: QuoteReviewStatus; lines: CommerceQuoteLineDTO[]; subtotalCents: number; currency: "CAD" | "USD"; createdAt: string; }
