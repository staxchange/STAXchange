import { NextResponse } from "next/server";
import { AttachPhotoQuotePhotoCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"intakeId":"photo-intake-placeholder","photoType":"EQUIPMENT_OVERVIEW","storageBucket":"service-attachments","storagePath":"placeholder/photo.jpg","uploadedBy":"operator-placeholder"};
  const result = await new AttachPhotoQuotePhotoCommand().run(input, {
    actor: { id: "operator-placeholder", role: "TECHNICIAN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
