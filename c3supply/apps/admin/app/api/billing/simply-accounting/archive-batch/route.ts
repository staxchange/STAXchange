import { NextResponse } from "next/server";
import { ArchiveSimplyAccountingExportBatchCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"batchId":"batch-placeholder","archivedBy":"finance-placeholder"};

  const result = await new ArchiveSimplyAccountingExportBatchCommand().run(input, {
    actor: { id: "finance-accounting-placeholder", role: "FINANCE" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
