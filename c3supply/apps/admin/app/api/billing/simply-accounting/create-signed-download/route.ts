import { NextResponse } from "next/server";
import { CreateSimplyAccountingSignedDownloadCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"batchId":"batch-placeholder","fileId":"file-placeholder","url":"https://example.invalid/signed-download","expiresAt":"2026-05-13T12:00:00.000Z"};

  const result = await new CreateSimplyAccountingSignedDownloadCommand().run(input, {
    actor: { id: "finance-accounting-placeholder", role: "FINANCE" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
