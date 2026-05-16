import { NextResponse } from "next/server";
import { SubmitCommerceInvoiceForFinanceReviewCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"invoiceId":"invoice-placeholder","submittedBy":"ops-placeholder"};
  const result = await new SubmitCommerceInvoiceForFinanceReviewCommand().run(input, { actor: { id: "finance-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result);
}
