import { NextResponse } from "next/server";
import { LinkCustomerSystemCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"customerId":"customer-placeholder","treatmentSystemId":"system-placeholder","accessLevel":"VIEW_ONLY"};

  const result = await new LinkCustomerSystemCommand().run(input, {
    actor: { id: "customer-portal-placeholder", role: "CUSTOMER" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
