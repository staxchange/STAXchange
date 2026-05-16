import { NextResponse } from "next/server";
import { CreateMaintenancePlanCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"customerId":"customer-placeholder","frequency":"QUARTERLY"};

  const result = await new CreateMaintenancePlanCommand().run(input, {
    actor: { id: "customer-portal-placeholder", role: "CUSTOMER" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
