import { evaluatePublicSurfaceSafety } from "@stax/e2e-readiness";

test("public-safe text passes", () => {
  expect(evaluatePublicSurfaceSafety("Order status: shipment pending.").ok).toBe(true);
});

test("supplier cost and internal C3 language fail public safety", () => {
  expect(evaluatePublicSurfaceSafety("supplier cost").supplierCostVisible).toBe(true);
  expect(evaluatePublicSurfaceSafety("technician portal").dwgInternalLanguageVisible).toBe(true);
});
