import { NextResponse } from "next/server";
import { CreateCommerceQuoteRequestCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"customerId":"c3-customer-placeholder","notes":"C3 quote request"};
  const result = await new CreateCommerceQuoteRequestCommand().run(input, {
    actor: { id: "c3-public", role: "PUBLIC" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
