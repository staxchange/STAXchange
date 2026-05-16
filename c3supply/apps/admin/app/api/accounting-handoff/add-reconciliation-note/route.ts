import { NextResponse } from "next/server";
import { AddAccountingReconciliationNoteCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"handoffId":"handoff-placeholder","note":"Manual export reconciled.","createdBy":"finance-placeholder"};
  const result = await new AddAccountingReconciliationNoteCommand().run(input, { actor: { id: "finance-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
