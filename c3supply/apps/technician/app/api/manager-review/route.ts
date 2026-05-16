import { NextResponse } from "next/server";
import { ApproveServiceCloseoutCommand, RejectServiceCloseoutCommand } from "@stax/commands";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const context = {
    actor: { id: body.reviewerActorId ?? "manager-demo-actor", role: "SERVICE_MANAGER" as const },
    requestId: crypto.randomUUID()
  };

  const result = body.decision === "REJECTED"
    ? await new RejectServiceCloseoutCommand().run(
        {
          closeoutId: body.closeoutId,
          workOrderId: body.workOrderId,
          reviewerId: body.reviewerId ?? "manager-demo",
          reason: body.reason
        },
        context
      )
    : await new ApproveServiceCloseoutCommand().run(
        {
          closeoutId: body.closeoutId,
          workOrderId: body.workOrderId,
          reviewerId: body.reviewerId ?? "manager-demo"
        },
        context
      );

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
