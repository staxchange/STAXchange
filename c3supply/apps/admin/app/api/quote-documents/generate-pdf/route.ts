import { NextResponse } from "next/server";
import { GenerateQuotePdfCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","documentApproved":true,"generatedBy":"sales-placeholder"};
  const result = await new GenerateQuotePdfCommand().run(input, { actor: { id: "admin-placeholder", role: "SALES" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
