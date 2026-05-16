import { NextResponse } from "next/server";
import { SubmitAccountingExportReviewCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"handoffId":"handoff-placeholder","submittedBy":"finance-placeholder"};
  const result = await new SubmitAccountingExportReviewCommand().run(input, { actor: { id: "finance-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
