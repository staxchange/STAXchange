import { NextResponse } from "next/server";
import { MarkSimplyAccountingExportedCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"batchId":"batch-placeholder","exportedBy":"finance-placeholder","note":"Marked exported after manual accounting import."};

  const result = await new MarkSimplyAccountingExportedCommand().run(input, {
    actor: { id: "finance-accounting-placeholder", role: "FINANCE" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
