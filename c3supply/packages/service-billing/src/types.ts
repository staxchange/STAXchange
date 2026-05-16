export type ServiceInvoiceStatus =
  | "DRAFT"
  | "LINE_ITEMS_ADDED"
  | "REVIEW_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "BILLING_PACKET_CREATED"
  | "SIMPLY_ACCOUNTING_EXPORT_BATCHED"
  | "READY_FOR_SIMPLY_ACCOUNTING_EXPORT";

export type BillingCurrency = "CAD" | "USD";

export type LaborEntryStatus = "DRAFT" | "SUBMITTED" | "REVIEWED";

export interface LaborEntryDTO {
  id: string;
  workOrderId: string;
  technicianId: string;
  description: string;
  hours: number;
  rateCents?: number;
  status: LaborEntryStatus;
  createdAt: string;
}

export interface ServicePartUsedDTO {
  id: string;
  workOrderId: string;
  sku?: string;
  productId?: string;
  description: string;
  quantity: number;
  unitCostCents?: number;
  billable: boolean;
  createdAt: string;
}

export interface ServiceInvoiceLineItemDTO {
  id: string;
  invoiceId: string;
  kind: "LABOR" | "PART" | "SERVICE" | "ADJUSTMENT";
  description: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
}

export interface ServiceInvoiceDraftDTO {
  id: string;
  workOrderId: string;
  customerId?: string;
  status: ServiceInvoiceStatus;
  currency: BillingCurrency;
  lineItems: ServiceInvoiceLineItemDTO[];
  subtotalCents: number;
  createdAt: string;
}

export interface BillingPacketDTO {
  id: string;
  invoiceId: string;
  status: "CREATED" | "READY_FOR_EXPORT";
  createdAt: string;
}

export interface SimplyAccountingExportBatchDTO {
  id: string;
  batchNumber: string;
  status: "CREATED" | "READY_FOR_SIMPLY_ACCOUNTING_EXPORT" | "EXPORTED" | "FAILED";
  itemCount: number;
  createdAt: string;
}

export type SageExportBatchDTO = SimplyAccountingExportBatchDTO;

export interface MaintenanceFollowupDTO {
  id: string;
  workOrderId: string;
  reason: string;
  targetDate?: string;
  status: "REVIEW_REQUIRED" | "CREATED" | "CLOSED";
  createdAt: string;
}
