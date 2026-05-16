export function accountingHandoffRequiresApprovedInvoice(invoiceStatus: string): boolean { return invoiceStatus === "INVOICE_APPROVED"; }
export function simplyAccountingExportIsPrepOnly(): true { return true; }
export function directAccountingSyncAllowed(): false { return false; }
export function autoPostingEntriesAllowed(): false { return false; }
