export type SupplierPurchaseOrderStatus =
  | "SUPPLIER_PO_DRAFTED"
  | "SUPPLIER_PO_REVIEW_REQUIRED"
  | "SUPPLIER_PO_APPROVED"
  | "SUPPLIER_PO_REJECTED"
  | "SUPPLIER_PO_REVISION_REQUIRED"
  | "SUPPLIER_PO_SENT_MANUALLY"
  | "DROPSHIP_REQUEST_PREPARED";

export interface SupplierPurchaseOrderLineDTO { id: string; productId: string; quantity: number; }
export interface SupplierPurchaseOrderDraftDTO {
  id: string;
  supplierName: string;
  fulfillmentPlanId: string;
  status: SupplierPurchaseOrderStatus;
  lines: SupplierPurchaseOrderLineDTO[];
  customerVisible: false;
  autoSendAllowed: false;
}
export interface SupplierPOReviewDTO { id: string; supplierPoId: string; reviewedBy: string; status: "APPROVED" | "REJECTED" | "REVISION_REQUIRED"; reason?: string; }
export interface DropshipRequestDTO { id: string; supplierPoId: string; supplierName: string; preparedOnly: true; status: "DROPSHIP_REQUEST_PREPARED"; }
