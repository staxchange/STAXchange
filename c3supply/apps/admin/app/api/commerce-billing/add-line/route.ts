import { NextResponse } from "next/server";
import { AddCommerceInvoiceLineCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"invoiceId":"invoice-placeholder","description":"Line placeholder","quantity":1,"unitPriceCents":10000};
  const result = await new AddCommerceInvoiceLineCommand().run(input, { actor: { id: "finance-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
