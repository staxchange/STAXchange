import { NextResponse } from "next/server";
import { ClosePhotoQuoteIntakeCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"intakeId":"photo-intake-placeholder","closedBy":"manager-placeholder","reason":"Closed after review."};
  const result = await new ClosePhotoQuoteIntakeCommand().run(input, {
    actor: { id: "operator-placeholder", role: "TECHNICIAN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
