import { NextResponse } from "next/server";
import { authenticateServiceAdminRequest, createServiceCommandContextAdapters } from "@stax/service-interface";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await authenticateServiceAdminRequest(request);
    const adapters = createServiceCommandContextAdapters();
    const requests = await adapters.repositories.service.listServiceRequests();
    const workOrders = await adapters.repositories.service.listWorkOrders();

    return NextResponse.json({ ok: true, data: { requests, workOrders } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unauthorized service queue request." },
      { status: 401 }
    );
  }
}
