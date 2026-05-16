import { NextResponse } from "next/server";
import { ScheduleMaintenancePlanVisitCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"maintenancePlanId":"plan-placeholder","scheduledAt":"2026-06-01T15:00:00.000Z"};

  const result = await new ScheduleMaintenancePlanVisitCommand().run(input, {
    actor: { id: "admin-ops-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
