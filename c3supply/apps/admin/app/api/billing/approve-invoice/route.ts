import { NextResponse } from "next/server";
import { ApproveServiceInvoiceCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"invoiceId":"placeholder-invoice","approvedBy":"finance-placeholder"};

  const result = await new ApproveServiceInvoiceCommand().run(input, {
    actor: { id: "admin-billing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
