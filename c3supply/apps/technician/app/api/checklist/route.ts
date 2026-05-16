import { NextResponse } from "next/server";
import { CompleteTechnicianChecklistItemCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await new CompleteTechnicianChecklistItemCommand().run(
    { workOrderId: body.workOrderId, checklistItemId: body.checklistItemId, technicianId: body.technicianId ?? "tech-demo", value: body.value },
    { actor: { id: body.actorId ?? "tech-demo-actor", role: "TECHNICIAN" as const }, requestId: crypto.randomUUID() }
  );

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
