import { NextResponse } from "next/server";
import { CreateCommerceInvoiceDraftCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteId":"quote-placeholder","orderId":"order-placeholder","paymentId":"payment-placeholder","fulfillmentId":"fulfillment-placeholder","customerId":"customer-placeholder","currency":"CAD","invoiceSubtotalCents":10000};
  const result = await new CreateCommerceInvoiceDraftCommand().run(input, { actor: { id: "finance-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
