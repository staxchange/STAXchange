import { NextResponse } from "next/server";
import { authenticateServiceAdminRequest, createServiceCommandContextAdapters } from "@stax/service-interface";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await authenticateServiceAdminRequest(request);
    const repository = createServiceCommandContextAdapters().repositories.service;
    const technicians = repository.listTechnicians ? await repository.listTechnicians() : [];

    return NextResponse.json({ ok: true, data: { technicians } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unauthorized technician request." },
      { status: 401 }
    );
  }
}
