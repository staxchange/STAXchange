import type { ServiceInvoiceDraftDTO, ServiceInvoiceLineItemDTO } from "./types";

export function invoiceSubtotalCents(lineItems: ServiceInvoiceLineItemDTO[]): number {
  return lineItems.reduce((total, item) => total + item.totalCents, 0);
}

export function createInvoiceDraftDTO(input: {
  id: string;
  workOrderId: string;
  currency?: "CAD" | "USD";
  lineItems?: ServiceInvoiceLineItemDTO[];
}): ServiceInvoiceDraftDTO {
  const lineItems = input.lineItems ?? [];

  return {
    id: input.id,
    workOrderId: input.workOrderId,
    status: lineItems.length ? "LINE_ITEMS_ADDED" : "DRAFT",
    currency: input.currency ?? "CAD",
    lineItems,
    subtotalCents: invoiceSubtotalCents(lineItems),
    createdAt: new Date().toISOString()
  };
}
