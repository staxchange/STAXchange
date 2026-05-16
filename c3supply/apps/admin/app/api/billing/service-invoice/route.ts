import { NextResponse } from "next/server";
import { CreateServiceInvoiceDraftCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"workOrderId":"placeholder-work-order","currency":"CAD"};

  const result = await new CreateServiceInvoiceDraftCommand().run(input, {
    actor: { id: "admin-billing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
