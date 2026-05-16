import { NextResponse } from "next/server";
import { MarkNotificationSentCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"notificationId":"notification-placeholder"};

  const result = await new MarkNotificationSentCommand().run(input, {
    actor: { id: "admin-ops-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
