import { NextResponse } from "next/server";
import { QueueCustomerNotificationCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"recipient":"customer@example.com","channel":"EMAIL","templateId":"SERVICE_REQUEST_RECEIVED","payload":{}};

  const result = await new QueueCustomerNotificationCommand().run(input, {
    actor: { id: "admin-ops-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
