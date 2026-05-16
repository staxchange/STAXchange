import { NextResponse } from "next/server";
import { CreateQuoteShareLinkCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","documentApproved":true,"expiresAt":"2099-01-01T00:00:00.000Z","createdBy":"sales-placeholder"};
  const result = await new CreateQuoteShareLinkCommand().run(input, { actor: { id: "admin-placeholder", role: "SALES" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
