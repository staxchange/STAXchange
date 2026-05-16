export type QuoteDeliveryStatus =
  | "DELIVERY_DRAFTED"
  | "DOCUMENT_STORED"
  | "SHARE_LINK_READY"
  | "CUSTOMER_NOTIFIED"
  | "QUOTE_VIEWED"
  | "CUSTOMER_ACCEPTED"
  | "REVISION_REQUESTED"
  | "DELIVERY_FAILED"
  | "DELIVERY_EXPIRED"
  | "DELIVERY_CLOSED";

export type QuoteDeliveryChannel = "EMAIL" | "SECURE_LINK" | "MANUAL_SEND" | "CUSTOMER_PORTAL";

export interface QuoteDeliveryDTO {
  id: string;
  quoteId: string;
  quoteDocumentId: string;
  quotePricingSnapshotId: string;
  customerId?: string;
  customerEmail?: string;
  channel: QuoteDeliveryChannel;
  status: QuoteDeliveryStatus;
  pricingApproved: boolean;
  pricingLocked: boolean;
  documentApproved: boolean;
  createdAt: string;
}

export interface QuoteStoredDocumentDTO {
  id: string;
  quoteDeliveryId: string;
  quoteDocumentId: string;
  storageBucket: string;
  storagePath: string;
  contentType: "text/html" | "application/pdf";
  customerSafe: true;
  createdAt: string;
}

export interface QuoteShareTokenDTO {
  id: string;
  quoteDeliveryId: string;
  tokenHash: string;
  expiresAt: string;
  createdAt: string;
}

export interface QuoteNotificationDTO {
  id: string;
  quoteDeliveryId: string;
  channel: QuoteDeliveryChannel;
  recipient: string;
  status: "SKIPPED" | "QUEUED" | "SENT" | "FAILED";
  reason?: string;
  createdAt: string;
}

export interface CustomerQuoteActionDTO {
  id: string;
  quoteDeliveryId: string;
  action: "VIEWED" | "ACCEPTED" | "REVISION_REQUESTED";
  actorId?: string;
  createdAt: string;
}

export interface QuoteDeliveryAuditDTO {
  id: string;
  quoteDeliveryId: string;
  action: string;
  actorId: string;
  createdAt: string;
}
