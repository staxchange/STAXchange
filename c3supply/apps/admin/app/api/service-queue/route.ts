import { NextResponse } from "next/server";
import {
  createSupabaseServiceRoleClient,
  createSupabaseServiceRepository,
  requireServiceActor
} from "@stax/service-interface";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const supabase = createSupabaseServiceRoleClient(process.env);
    await requireServiceActor(
      supabase,
      request,
      ["OPS", "ADMIN", "SUPER_ADMIN"],
      process.env.SUPABASE_JWT_COOKIE_NAME
    );

    const repository = createSupabaseServiceRepository(supabase);
    const [serviceRequests, workOrders] = await Promise.all([
      repository.listServiceRequests(),
      repository.listWorkOrders()
    ]);

    return NextResponse.json({ ok: true, data: { serviceRequests, workOrders } });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unauthorized service queue request." },
      { status: 401 }
    );
  }
}
