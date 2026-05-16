import { NextResponse } from "next/server";
import { CreateQuoteRequestCommand } from "@stax/commands";

export async function POST(request: Request) {
  const form = await request.formData();

  const command = new CreateQuoteRequestCommand();
  const result = await command.run(
    {
      company: String(form.get("company") ?? ""),
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      details: String(form.get("details") ?? "")
    },
    {
      actor: { id: "public-web", role: "PUBLIC" },
      requestId: crypto.randomUUID()
    }
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/quote/thank-you", request.url), 303);
}
