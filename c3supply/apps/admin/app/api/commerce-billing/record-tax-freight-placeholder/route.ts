import { NextResponse } from "next/server";
import { RecordTaxFreightPlaceholderCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"invoiceId":"invoice-placeholder","taxPlaceholderCents":0,"freightPlaceholderCents":0,"recordedBy":"ops-placeholder"};
  const result = await new RecordTaxFreightPlaceholderCommand().run(input, { actor: { id: "finance-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
