import { NextResponse } from "next/server";
import { actorFromHeaders } from "@stax/authz";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = actorFromHeaders(request.headers);

  return NextResponse.json({
    ok: Boolean(actor),
    actor
  });
}
