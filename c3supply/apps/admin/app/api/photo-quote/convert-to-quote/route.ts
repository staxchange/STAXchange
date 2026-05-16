import { NextResponse } from "next/server";
import { ConvertPhotoQuoteToCommerceQuoteCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"intakeId":"photo-intake-placeholder","convertedBy":"admin-placeholder"};
  const result = await new ConvertPhotoQuoteToCommerceQuoteCommand().run(input, {
    actor: { id: "admin-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
