import { NextResponse } from "next/server";
import {
  checkInMemoryRateLimit,
  createServiceUploadSignedUrl,
  createSupabaseServiceRoleClient,
  getClientRateLimitKey
} from "@stax/service-interface";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rateLimit = checkInMemoryRateLimit(getClientRateLimitKey(request, "service-upload"), {
    max: 12,
    windowMs: 60_000
  });

  if (!rateLimit.allowed) {
    return NextResponse.json({ ok: false, error: "Too many upload requests." }, { status: 429 });
  }

  try {
    const body = (await request.json()) as {
      serviceRequestId?: string;
      workOrderId?: string;
      fileName?: string;
      contentType?: string;
      purpose?: "service-photo" | "water-test" | "work-order-document";
    };

    const supabase = createSupabaseServiceRoleClient(process.env);
    const upload = await createServiceUploadSignedUrl(supabase, {
      bucket: process.env.SERVICE_UPLOAD_BUCKET ?? "service-uploads",
      serviceRequestId: body.serviceRequestId,
      workOrderId: body.workOrderId,
      fileName: body.fileName ?? "upload",
      contentType: body.contentType ?? "application/octet-stream",
      purpose: body.purpose ?? "service-photo",
      expiresInSeconds: Number(process.env.SERVICE_UPLOAD_SIGNED_URL_TTL_SECONDS ?? 7200)
    });

    return NextResponse.json({ ok: true, data: upload });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown upload error." },
      { status: 400 }
    );
  }
}
