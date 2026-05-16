import { NextResponse } from "next/server";
import {
  checkInMemoryRateLimit,
  classifyServiceRequest,
  createServiceCommandContextAdapters,
  getClientRateLimitKey,
  sanitizeServiceRequestInput,
  serviceSLAForClassification,
  type CreateServiceRequestApiResponse
} from "@stax/service-interface";
import {
  CreateServiceRequestCommand,
  EscalateEmergencyServiceCommand,
  TriageServiceRequestCommand
} from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const rateLimit = checkInMemoryRateLimit(getClientRateLimitKey(request, "service-request"), {
    max: Number(process.env.SERVICE_RATE_LIMIT_MAX ?? 8),
    windowMs: Number(process.env.SERVICE_RATE_LIMIT_WINDOW_MS ?? 60_000)
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many service requests. Please wait before trying again.", retryAfterSeconds: rateLimit.retryAfterSeconds },
      { status: 429, headers: { "X-RateLimit-Reset": String(rateLimit.resetAt) } }
    );
  }

  try {
    const raw = await request.json();
    const input = sanitizeServiceRequestInput(raw);
    const classification = classifyServiceRequest(input);
    const sla = serviceSLAForClassification(classification);
    const serviceAdapters = createServiceCommandContextAdapters(process.env);

    const publicCommandContext = {
      actor: { id: "public-service-request", role: "PUBLIC" as const },
      requestId,
      ...serviceAdapters
    };

    const serviceOpsCommandContext = {
      actor: { id: "service-intake-system", role: "OPS" as const },
      requestId,
      ...serviceAdapters
    };

    const createResult = await new CreateServiceRequestCommand().run(
      {
        customerName: input.customer.name,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        company: input.customer.company,
        siteAddress: input.customer.siteAddress,
        systemId: input.systemId,
        systemType: input.systemType,
        issueDescription: input.issueDescription,
        preferredServiceWindow: input.preferredServiceWindow,
        siteAccessNotes: input.siteAccessNotes,
        severity: classification.severity,
        category: classification.category,
        emergencyEscalation: classification.emergencyEscalation
      },
      publicCommandContext
    );

    if (!createResult.ok || !createResult.data) {
      return NextResponse.json({ ok: false, error: createResult.error }, { status: 400 });
    }

    await new TriageServiceRequestCommand().run(
      {
        serviceRequestId: createResult.data.id,
        severity: classification.severity,
        category: classification.category,
        reason: classification.reason
      },
      serviceOpsCommandContext
    );

    if (classification.emergencyEscalation) {
      await new EscalateEmergencyServiceCommand().run(
        {
          serviceRequestId: createResult.data.id,
          reason: classification.reason,
          customerPhone: input.customer.phone,
          customerEmail: input.customer.email
        },
        serviceOpsCommandContext
      );
    }

    const response: CreateServiceRequestApiResponse = {
      serviceRequest: {
        id: createResult.data.id,
        brandId: "dwg",
        status: classification.emergencyEscalation ? "ESCALATED" : "TRIAGED",
        customer: input.customer,
        systemId: input.systemId,
        systemType: input.systemType,
        issueDescription: input.issueDescription,
        classification,
        createdAt: new Date().toISOString()
      },
      message: classification.emergencyEscalation
        ? "Your request was flagged for urgent human service review."
        : `Your service request was received. Target response: ${sla.targetResponseHours} hours.`
    };

    return NextResponse.json({ ok: true, data: response });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown service request error."
      },
      { status: 400 }
    );
  }
}
