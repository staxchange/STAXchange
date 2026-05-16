import { NextResponse } from "next/server";
import { CreateSageExportBatchCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"batchNumber":"BATCH-PLACEHOLDER","invoiceIds":["placeholder-invoice"]};

  const result = await new CreateSageExportBatchCommand().run(input, {
    actor: { id: "admin-billing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
