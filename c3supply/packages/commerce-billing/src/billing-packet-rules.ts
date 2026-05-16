export function billingPacketRequiresApprovedInvoice(status: string): boolean { return status === "INVOICE_APPROVED"; }
export function billingPacketRequiredBeforeExport(): true { return true; }
