export interface AuditEventDTO {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  workflow: string;
  entityId?: string;
  requestId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}
