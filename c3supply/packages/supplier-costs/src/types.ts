export type SupplierCurrency = "USD" | "CAD";
export type SupplierCostStatus = "DRAFT" | "ACTIVE" | "STALE" | "REJECTED";
export type CostFreshnessStatus = "FRESH" | "STALE" | "UNKNOWN";

export interface SupplierCostSourceDTO {
  id: string;
  supplierName: string;
  sourceDocumentId?: string;
  sourceType: "CATALOG" | "QUOTE" | "MANUAL_ENTRY";
  currency: SupplierCurrency;
  createdAt: string;
}

export interface SupplierCostRecordDTO {
  id: string;
  productId: string;
  supplierName: string;
  costCents: number;
  currency: SupplierCurrency;
  costLevel: "SINGLE_PURCHASE";
  status: SupplierCostStatus;
  effectiveAt: string;
  staleAfterDays: number;
  createdAt: string;
}
