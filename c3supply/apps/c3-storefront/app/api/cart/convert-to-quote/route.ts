import { NextResponse } from "next/server";
import { ConvertCartToQuoteRequestCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"cartId":"c3-cart-placeholder","customerId":"c3-customer-placeholder"};
  const result = await new ConvertCartToQuoteRequestCommand().run(input, {
    actor: { id: "c3-public", role: "PUBLIC" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
