import type { OrderDTO } from "./types";

export function orderCanBeCreatedFromQuoteStatus(status: string): boolean { return status === "QUOTE_ACCEPTED"; }
export function createOrderDraftFromAcceptedQuote(input: { id: string; quoteId: string; quoteStatus: string }): OrderDTO {
  if (!orderCanBeCreatedFromQuoteStatus(input.quoteStatus)) throw new Error("Order can only be created from accepted quote.");
  return { id: input.id, quoteId: input.quoteId, status: "CREATED", fulfillmentStatus: "PENDING", billingReadiness: "NOT_READY", lines: [], createdAt: new Date().toISOString() };
}
