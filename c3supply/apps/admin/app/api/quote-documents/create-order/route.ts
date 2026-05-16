import { NextResponse } from "next/server";
import { CreateOrderFromCustomerAcceptanceCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteDocumentId":"quote-doc-placeholder","acceptanceId":"acceptance-placeholder","customerAccepted":true,"createdBy":"sales-placeholder"};
  const result = await new CreateOrderFromCustomerAcceptanceCommand().run(input, { actor: { id: "admin-placeholder", role: "OPS" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
