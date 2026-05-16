import { NextResponse } from "next/server";
import { AttachServicePhotoCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await new AttachServicePhotoCommand().run(
    { workOrderId: body.workOrderId, technicianId: body.technicianId ?? "tech-demo", objectPath: body.objectPath ?? `service-photos/${body.workOrderId}/placeholder`, contentType: body.contentType ?? "image/jpeg" },
    { actor: { id: body.actorId ?? "tech-demo-actor", role: "TECHNICIAN" as const }, requestId: crypto.randomUUID() }
  );

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
