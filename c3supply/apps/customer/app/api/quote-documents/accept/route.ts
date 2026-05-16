import { NextResponse } from "next/server";
import { AcceptCustomerQuoteCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","acceptedBy":"customer-placeholder","termsAccepted":true,"quoteExpired":false,"shareLinkValid":true};
  const result = await new AcceptCustomerQuoteCommand().run(input, { actor: { id: "customer-placeholder", role: "CUSTOMER" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
