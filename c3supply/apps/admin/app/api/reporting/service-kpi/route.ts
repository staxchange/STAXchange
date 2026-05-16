import { NextResponse } from "next/server";
import { GenerateServiceKpiSnapshotCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"openServiceRequests":0,"emergencyEscalations":0,"completedWorkOrders":0};

  const result = await new GenerateServiceKpiSnapshotCommand().run(input, {
    actor: { id: "admin-ops-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
