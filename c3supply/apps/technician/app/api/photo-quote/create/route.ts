import { NextResponse } from "next/server";
import { CreatePhotoQuoteIntakeCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"customerName":"Placeholder Customer","siteName":"Placeholder Site","operatorId":"operator-placeholder","priority":"STANDARD","notes":"Operator notes provided for human review."};
  const result = await new CreatePhotoQuoteIntakeCommand().run(input, {
    actor: { id: "operator-placeholder", role: "TECHNICIAN" },
    requestId: crypto.randomUUID()
  });
  return NextResponse.json(result);
}
