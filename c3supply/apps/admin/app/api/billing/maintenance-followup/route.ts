import { NextResponse } from "next/server";
import { CreateMaintenanceFollowupCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"workOrderId":"placeholder-work-order","reason":"Placeholder follow-up"};

  const result = await new CreateMaintenanceFollowupCommand().run(input, {
    actor: { id: "admin-billing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
