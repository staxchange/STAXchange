import { NextResponse } from "next/server";
import { AddCartItemCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"cartId": "cart-placeholder", "productId": "dwg-prod-filter-001", "name": "Replacement Filter Cartridge", "quantity": 1, "quoteRequired": false, "checkoutEligible": true};
  const result = await new AddCartItemCommand().run(input, { actor: { id: "public-commerce", role: "PUBLIC" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
