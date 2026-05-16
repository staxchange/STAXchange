import { NextResponse } from "next/server";
import { RequestPhotoQuoteHumanReviewCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"intakeId":"photo-intake-placeholder","requestedBy":"admin-placeholder","reason":"Human review requested."};
  const result = await new RequestPhotoQuoteHumanReviewCommand().run(input, {
    actor: { id: "admin-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
