import { NextResponse } from "next/server";
import { AddCartItemCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"cartId":"c3-cart-placeholder","productId":"product-placeholder","quantity":1,"quoteRequired":true};
  const result = await new AddCartItemCommand().run(input, {
    actor: { id: "c3-public", role: "PUBLIC" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
