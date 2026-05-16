import { NextResponse } from "next/server";
import { CreateOpsReportSnapshotCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = Object.keys(body).length ? body : {"reportDate":"2026-05-13"};

  const result = await new CreateOpsReportSnapshotCommand().run(input, {
    actor: { id: "admin-ops-placeholder", role: "ADMIN" },
    requestId: crypto.randomUUID()
  });

  return NextResponse.json(result);
}
