export type NotificationTemplateId =
  | "SERVICE_REQUEST_RECEIVED"
  | "SERVICE_VISIT_SCHEDULED"
  | "TECHNICIAN_EN_ROUTE"
  | "INVOICE_APPROVED"
  | "MAINTENANCE_REMINDER";

export function notificationSubject(templateId: NotificationTemplateId): string {
  const map: Record<NotificationTemplateId, string> = {
    SERVICE_REQUEST_RECEIVED: "DWG service request received",
    SERVICE_VISIT_SCHEDULED: "DWG service visit scheduled",
    TECHNICIAN_EN_ROUTE: "DWG technician update",
    INVOICE_APPROVED: "DWG invoice update",
    MAINTENANCE_REMINDER: "DWG maintenance reminder"
  };

  return map[templateId];
}
