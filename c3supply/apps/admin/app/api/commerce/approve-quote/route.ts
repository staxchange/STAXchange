import { NextResponse } from "next/server";
import { ApproveCommerceQuoteCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteId": "quote-placeholder", "approvedBy": "ops-placeholder", "humanReviewCompleted": true};
  const result = await new ApproveCommerceQuoteCommand().run(input, { actor: { id: "admin-commerce", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
