import { NextResponse } from "next/server";
import { ApproveQuoteDocumentCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","approvedBy":"admin-placeholder","humanReviewCompleted":true};
  const result = await new ApproveQuoteDocumentCommand().run(input, { actor: { id: "admin-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
