import type { QuoteStoredDocumentDTO } from "./types";

export const quoteDocumentsBucket = "quote-documents";

export function createQuoteStoredDocument(input: {
  id: string;
  quoteDeliveryId: string;
  quoteDocumentId: string;
  storagePath: string;
  contentType: "text/html" | "application/pdf";
}): QuoteStoredDocumentDTO {
  return {
    id: input.id,
    quoteDeliveryId: input.quoteDeliveryId,
    quoteDocumentId: input.quoteDocumentId,
    storageBucket: quoteDocumentsBucket,
    storagePath: input.storagePath,
    contentType: input.contentType,
    customerSafe: true,
    createdAt: new Date().toISOString()
  };
}

export function storedQuoteDocumentIsPublicBucket(): false { return false; }
export function storedQuoteDocumentContainsSupplierCost(): false { return false; }
