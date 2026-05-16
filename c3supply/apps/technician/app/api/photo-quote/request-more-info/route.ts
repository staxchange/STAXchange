import { NextResponse } from "next/server";
import { RequestMorePhotoQuoteInfoCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"intakeId":"photo-intake-placeholder","requestedBy":"manager-placeholder","reason":"More nameplate/context photos requested."};
  const result = await new RequestMorePhotoQuoteInfoCommand().run(input, {
    actor: { id: "operator-placeholder", role: "TECHNICIAN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
