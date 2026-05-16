import { NextResponse } from "next/server";
import { UpdateCartItemQuantityCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"cartId": "cart-placeholder", "itemId": "item-placeholder", "quantity": 2};
  const result = await new UpdateCartItemQuantityCommand().run(input, { actor: { id: "public-commerce", role: "PUBLIC" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
