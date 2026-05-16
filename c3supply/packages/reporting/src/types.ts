export interface ServiceKpiSnapshotDTO {
  id: string;
  openServiceRequests: number;
  emergencyEscalations: number;
  completedWorkOrders: number;
  averageResponseHours?: number;
  createdAt: string;
}

export interface BillingKpiSnapshotDTO {
  id: string;
  invoiceDrafts: number;
  invoicesApproved: number;
  sageBatchesReady: number;
  totalApprovedCents: number;
  createdAt: string;
}

export interface InventoryKpiSnapshotDTO {
  id: string;
  lowStockItems: number;
  outOfStockItems: number;
  pendingAdjustments: number;
  createdAt: string;
}

export interface OpsReportSnapshotDTO {
  id: string;
  service: ServiceKpiSnapshotDTO;
  billing: BillingKpiSnapshotDTO;
  inventory: InventoryKpiSnapshotDTO;
  createdAt: string;
}
