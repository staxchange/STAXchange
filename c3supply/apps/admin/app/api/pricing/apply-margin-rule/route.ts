import { NextResponse } from "next/server";
import { ApplyMarginRuleCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"quoteId":"quote-placeholder","sellPriceCents":15000,"costCents":10000,"minimumMarginPercent":25};
  const result = await new ApplyMarginRuleCommand().run(input, {
    actor: { id: "admin-pricing-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
