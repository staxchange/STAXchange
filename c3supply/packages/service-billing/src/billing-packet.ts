import type { BillingPacketDTO } from "./types";

export function createBillingPacketDTO(invoiceId: string): BillingPacketDTO {
  return {
    id: `billing-packet-${invoiceId}`,
    invoiceId,
    status: "CREATED",
    createdAt: new Date().toISOString()
  };
}
