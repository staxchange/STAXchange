import { NextResponse } from "next/server";
import { ExpireQuoteCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","expiredBy":"sales-placeholder"};
  const result = await new ExpireQuoteCommand().run(input, { actor: { id: "admin-placeholder", role: "SALES" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
