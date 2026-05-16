export function exportReadinessRequiresBillingPacket(input: { approvedInvoice: boolean; billingPacketCreated: boolean }): boolean {
  return input.approvedInvoice && input.billingPacketCreated;
}
