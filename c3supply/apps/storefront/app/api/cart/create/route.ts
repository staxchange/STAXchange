import { NextResponse } from "next/server";
import { CreateCartCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"customerEmail": "customer@example.com"};
  const result = await new CreateCartCommand().run(input, { actor: { id: "public-commerce", role: "PUBLIC" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
