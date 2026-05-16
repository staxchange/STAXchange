import { defaultCurrencyForSupplier, staleCostBlocksApproval, supplierCostIsInternalOnly, validateSupplierCost } from "@stax/supplier-costs";

const record = {
  id: "cost-1",
  productId: "product-1",
  supplierName: "Goodwater",
  costCents: 10000,
  currency: "USD" as const,
  costLevel: "SINGLE_PURCHASE" as const,
  status: "ACTIVE" as const,
  effectiveAt: "2020-01-01T00:00:00.000Z",
  staleAfterDays: 30,
  createdAt: new Date().toISOString()
};

test("Goodwater defaults to USD", () => {
  expect(defaultCurrencyForSupplier("Goodwater")).toBe("USD");
});

test("supplier costs are internal only", () => {
  expect(supplierCostIsInternalOnly()).toBe(true);
});

test("stale cost blocks approval", () => {
  expect(staleCostBlocksApproval(record, new Date("2026-01-01T00:00:00.000Z"))).toBe(true);
});

test("supplier cost validates explicit currency and single purchase level", () => {
  expect(validateSupplierCost(record)).toEqual([]);
});
