import { NextResponse } from "next/server";
import { RequestMorePhotoQuoteInfoCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"intakeId":"photo-intake-placeholder","requestedBy":"admin-placeholder","reason":"More info needed."};
  const result = await new RequestMorePhotoQuoteInfoCommand().run(input, {
    actor: { id: "admin-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
