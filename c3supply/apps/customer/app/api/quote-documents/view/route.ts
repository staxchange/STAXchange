import { NextResponse } from "next/server";
import { RecordQuoteViewedCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","viewerId":"customer-placeholder"};
  const result = await new RecordQuoteViewedCommand().run(input, { actor: { id: "customer-placeholder", role: "CUSTOMER" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
