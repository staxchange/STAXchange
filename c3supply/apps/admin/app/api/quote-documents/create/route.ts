import { NextResponse } from "next/server";
import { CreateQuoteDocumentCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"commerceQuoteId":"commerce-quote-placeholder","approvedCommerceQuote":true,"customerName":"Customer"};
  const result = await new CreateQuoteDocumentCommand().run(input, { actor: { id: "admin-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
