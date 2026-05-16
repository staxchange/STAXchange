import { NextResponse } from "next/server";
import { CreateCommerceQuoteRequestCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"customerName": "Customer", "customerEmail": "customer@example.com", "cartId": "cart-placeholder"};
  const result = await new CreateCommerceQuoteRequestCommand().run(input, { actor: { id: "public-commerce", role: "PUBLIC" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
