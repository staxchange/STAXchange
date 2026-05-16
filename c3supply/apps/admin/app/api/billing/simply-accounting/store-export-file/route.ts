import { NextResponse } from "next/server";
import { StoreSimplyAccountingExportFileCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"batchId":"batch-placeholder","fileName":"customers.csv","fileKind":"CUSTOMERS_CSV","storageBucket":"simply-accounting-export-files","storagePath":"simply-accounting/batch/customers.csv","rowCount":1};

  const result = await new StoreSimplyAccountingExportFileCommand().run(input, {
    actor: { id: "finance-accounting-placeholder", role: "FINANCE" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
