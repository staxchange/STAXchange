import { NextResponse } from "next/server";
import { SubmitCommerceQuoteForReviewCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteId": "quote-placeholder", "submittedBy": "sales-placeholder"};
  const result = await new SubmitCommerceQuoteForReviewCommand().run(input, { actor: { id: "admin-commerce", role: "ADMIN" }, requestId: crypto.randomUUID() });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
