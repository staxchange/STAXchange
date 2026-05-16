import { NextResponse } from "next/server";
import { RejectSimplyAccountingDownloadCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length
    ? body
    : {
        batchId: "batch-placeholder",
        rejectedBy: "finance-placeholder",
        reason: "Rejected during finance review."
      };

  const result = await new RejectSimplyAccountingDownloadCommand().run(input, {
    actor: { id: "finance-accounting-placeholder", role: "FINANCE" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
