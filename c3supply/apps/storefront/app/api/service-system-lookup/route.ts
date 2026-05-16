import { NextResponse } from "next/server";
import {
  createServiceCommandContextAdapters,
  createServiceRateLimiter,
  getClientRateLimitKey,
  type TreatmentSystemLookupApiRequest,
  type TreatmentSystemLookupApiResponse
} from "@stax/service-interface";

export const runtime = "nodejs";

const rateLimiter = createServiceRateLimiter();

export async function POST(request: Request) {
  const limit = rateLimiter.check(`system-lookup:${getClientRateLimitKey(request)}`);

  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many system lookup requests.", retryAfterSeconds: limit.retryAfterSeconds },
      { status: 429 }
    );
  }

  const body = (await request.json()) as TreatmentSystemLookupApiRequest;
  const adapters = createServiceCommandContextAdapters();
  const systems = await adapters.repositories.service.lookupTreatmentSystems({
    systemId: body.systemId,
    serialNumber: body.serialNumber,
    customerEmail: body.customerEmail
  });

  const response: TreatmentSystemLookupApiResponse = { systems };

  return NextResponse.json({ ok: true, data: response });
}
