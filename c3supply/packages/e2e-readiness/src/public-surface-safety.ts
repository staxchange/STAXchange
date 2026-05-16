import type { PublicSurfaceSafetyResultDTO } from "./types";

const supplierCostTerms = ["supplierCost", "supplier cost", "costCents", "supplier_cost", "marginPercent"];
const dwgInternalTerms = ["technician portal", "Simply Accounting export", "supplier PO"];
const collectiblesTerms = ["cards_master", "vault_items", "break room", "collectibles trust score"];

export function evaluatePublicSurfaceSafety(text: string): PublicSurfaceSafetyResultDTO {
  const supplierCostVisible = supplierCostTerms.some((term) => text.includes(term));
  const dwgInternalLanguageVisible = dwgInternalTerms.some((term) => text.includes(term));
  const collectiblesDriftVisible = collectiblesTerms.some((term) => text.includes(term));
  return {
    ok: !supplierCostVisible && !dwgInternalLanguageVisible && !collectiblesDriftVisible,
    supplierCostVisible,
    dwgInternalLanguageVisible,
    collectiblesDriftVisible
  };
}
