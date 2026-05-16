import { createCustomerFulfillmentView } from "@stax/fulfillment";
export default async function CustomerFulfillmentPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; const view = createCustomerFulfillmentView({ orderId, status: "SHIPMENT_PENDING" }); return <main><h1>Fulfillment status</h1><p>{view.customerMessage}</p></main>; }
