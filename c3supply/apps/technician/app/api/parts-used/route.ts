import { NextResponse } from "next/server";
import { AddServicePartUsedCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await new AddServicePartUsedCommand().run(
    { workOrderId: body.workOrderId, technicianId: body.technicianId ?? "tech-demo", description: body.description, sku: body.sku, quantity: Number(body.quantity ?? 1) },
    { actor: { id: body.actorId ?? "tech-demo-actor", role: "TECHNICIAN" as const }, requestId: crypto.randomUUID() }
  );

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
