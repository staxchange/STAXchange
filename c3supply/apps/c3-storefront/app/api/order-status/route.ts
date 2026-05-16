import { NextResponse } from "next/server";
import { createCustomerFulfillmentView } from "@stax/fulfillment";
export const runtime = "nodejs";
export async function GET() { return NextResponse.json(createCustomerFulfillmentView({ orderId: "c3-order-placeholder", status: "SHIPMENT_PENDING" })); }
