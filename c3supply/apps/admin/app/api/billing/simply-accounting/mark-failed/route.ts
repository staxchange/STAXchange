import { NextResponse } from "next/server";
import { MarkSimplyAccountingExportFailedCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"batchId":"batch-placeholder","failedBy":"finance-placeholder","reason":"Manual import failed during review."};

  const result = await new MarkSimplyAccountingExportFailedCommand().run(input, {
    actor: { id: "finance-accounting-placeholder", role: "FINANCE" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
