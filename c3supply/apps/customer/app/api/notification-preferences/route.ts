import { NextResponse } from "next/server";
import { UpdateCustomerNotificationPreferencesCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"customerId":"customer-placeholder","emailEnabled":true,"serviceUpdatesEnabled":true,"maintenanceRemindersEnabled":true,"billingUpdatesEnabled":true};

  const result = await new UpdateCustomerNotificationPreferencesCommand().run(input, {
    actor: { id: "customer-portal-placeholder", role: "CUSTOMER" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
