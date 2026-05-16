import { NextResponse } from "next/server";
import { RejectQuotePricingCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteId":"quote-placeholder","rejectedBy":"finance-placeholder","reason":"Margin too low."};
  const result = await new RejectQuotePricingCommand().run(input, {
    actor: { id: "admin-pricing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
