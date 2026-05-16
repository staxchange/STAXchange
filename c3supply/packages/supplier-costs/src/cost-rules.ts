import type { CostFreshnessStatus, SupplierCostRecordDTO, SupplierCurrency } from "./types";

export function defaultCurrencyForSupplier(supplierName: string): SupplierCurrency {
  return supplierName.toLowerCase().includes("goodwater") ? "USD" : "CAD";
}

export function supplierCostIsInternalOnly(): true {
  return true;
}

export function validateSupplierCost(record: SupplierCostRecordDTO): string[] {
  const errors: string[] = [];
  if (!record.productId) errors.push("productId is required.");
  if (!record.supplierName) errors.push("supplierName is required.");
  if (!record.currency) errors.push("currency is required.");
  if (record.costCents <= 0) errors.push("costCents must be positive.");
  if (record.costLevel !== "SINGLE_PURCHASE") errors.push("Only SINGLE_PURCHASE cost level is allowed.");
  return errors;
}

export function costFreshness(record: SupplierCostRecordDTO, now = new Date()): CostFreshnessStatus {
  if (record.status === "STALE") return "STALE";
  const effective = new Date(record.effectiveAt).getTime();
  if (!Number.isFinite(effective)) return "UNKNOWN";
  const ageDays = (now.getTime() - effective) / (24 * 60 * 60 * 1000);
  return ageDays > record.staleAfterDays ? "STALE" : "FRESH";
}

export function staleCostBlocksApproval(record: SupplierCostRecordDTO, now = new Date()): boolean {
  return costFreshness(record, now) !== "FRESH";
}
