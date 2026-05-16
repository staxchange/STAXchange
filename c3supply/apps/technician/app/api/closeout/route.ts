import { NextResponse } from "next/server";
import { SubmitTechnicianCloseoutCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await new SubmitTechnicianCloseoutCommand().run(
    { workOrderId: body.workOrderId, technicianId: body.technicianId ?? "tech-demo", findings: body.findings, actionsTaken: body.actionsTaken, followUpRequired: Boolean(body.followUpRequired) },
    { actor: { id: body.actorId ?? "tech-demo-actor", role: "TECHNICIAN" as const }, requestId: crypto.randomUUID() }
  );

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
