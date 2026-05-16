import { NextResponse } from "next/server";
import {
  createSampleSimplyAccountingBatch,
  createSimplyAccountingBatchManifest,
  createSimplyAccountingExportFiles
} from "@stax/accounting-export";
import { GenerateSimplyAccountingExportFileCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const batch = body.batch ?? createSampleSimplyAccountingBatch();

  const files = createSimplyAccountingExportFiles(batch);
  const manifest = createSimplyAccountingBatchManifest(batch, files);

  const commandResult = await new GenerateSimplyAccountingExportFileCommand().run(
    {
      batchId: batch.id,
      generatedBy: "finance-placeholder"
    },
    {
      actor: { id: "finance-export-placeholder", role: "FINANCE" },
      requestId: crypto.randomUUID()
    }
  );

  return NextResponse.json({
    ok: commandResult.ok,
    command: commandResult,
    manifest,
    files
  });
}
