export function canMarkSupplierPOSentManually(input: { approved: boolean; sentByHuman: boolean }): boolean {
  return input.approved && input.sentByHuman;
}
export function supplierPORevisionPathRequired(status: string): boolean {
  return status === "SUPPLIER_PO_REJECTED" || status === "SUPPLIER_PO_REVISION_REQUIRED";
}
