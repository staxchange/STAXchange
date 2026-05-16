import { NextResponse } from "next/server";
import { SendQuoteNotificationCommand } from "@stax/commands";
export const runtime = "nodejs";
export async function POST(request: Request) { const body = await request.json().catch(() => ({})); const input = Object.keys(body).length ? body : {"quoteDeliveryId":"delivery-placeholder","recipient":"customer@example.com","channel":"EMAIL"}; const result = await new SendQuoteNotificationCommand().run(input, { actor: { id: "admin-delivery-placeholder", role: "ADMIN" }, requestId: crypto.randomUUID() }); return NextResponse.json(result); }
