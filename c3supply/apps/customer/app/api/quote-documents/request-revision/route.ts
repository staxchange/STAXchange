import { NextResponse } from "next/server";
import { RequestQuoteRevisionCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","requestedBy":"customer-placeholder","reason":"Please revise scope."};
  const result = await new RequestQuoteRevisionCommand().run(input, { actor: { id: "customer-placeholder", role: "CUSTOMER" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
