export type QuoteDocumentStatus =
  | "DOCUMENT_DRAFTED"
  | "DOCUMENT_REVIEW_REQUIRED"
  | "DOCUMENT_APPROVED"
  | "PDF_READY"
  | "SHARE_LINK_CREATED"
  | "QUOTE_VIEWED"
  | "CUSTOMER_ACCEPTED"
  | "REVISION_REQUESTED"
  | "EXPIRED"
  | "ORDER_CREATED";

export interface QuoteDocumentLineDTO {
  id: string;
  quoteDocumentId: string;
  description: string;
  quantity: number;
  unitPriceCents?: number;
  totalCents?: number;
  humanReviewed: boolean;
}

export interface QuoteTermsDTO {
  paymentTerms: string;
  deliveryTerms?: string;
  exclusions?: string[];
  humanReviewStatement: string;
}

export interface QuoteValidityWindow {
  validFrom: string;
  validUntil: string;
}

export interface QuoteDocumentDTO {
  id: string;
  commerceQuoteId: string;
  customerName: string;
  customerEmail?: string;
  status: QuoteDocumentStatus;
  lines: QuoteDocumentLineDTO[];
  terms: QuoteTermsDTO;
  validity: QuoteValidityWindow;
  approvedCommerceQuote: boolean;
  documentApproved: boolean;
  createdAt: string;
}

export interface QuotePdfRenderInput {
  document: QuoteDocumentDTO;
  brandName: string;
  publicDomain: string;
}

export interface QuotePublicViewDTO {
  id: string;
  quoteDocumentId: string;
  customerName: string;
  status: QuoteDocumentStatus;
  lines: QuoteDocumentLineDTO[];
  terms: QuoteTermsDTO;
  validity: QuoteValidityWindow;
}

export interface QuoteShareLinkDTO {
  id: string;
  quoteDocumentId: string;
  token: string;
  expiresAt: string;
  documentApproved: boolean;
}

export interface QuoteAcceptanceDTO {
  id: string;
  quoteDocumentId: string;
  acceptedBy: string;
  acceptedAt: string;
  termsAccepted: true;
}

export interface QuoteRevisionRequestDTO {
  id: string;
  quoteDocumentId: string;
  requestedBy: string;
  reason: string;
  createdAt: string;
}
