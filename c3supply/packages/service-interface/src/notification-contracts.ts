import type { EmergencyServiceEscalationInput, PersistedServiceRequestRecord, ServiceWorkOrderRecord } from "./repository-contracts";

export interface ServiceNotificationResult {
  delivered: boolean;
  destination?: string;
  error?: string;
}

export interface ServiceNotifier {
  notifyServiceRequestCreated(record: PersistedServiceRequestRecord): Promise<ServiceNotificationResult>;
  notifyEmergencyEscalation(input: EmergencyServiceEscalationInput): Promise<ServiceNotificationResult>;
  notifyWorkOrderAssigned(record: ServiceWorkOrderRecord): Promise<ServiceNotificationResult>;
}

export function getServiceNotifier(notifications?: Record<string, unknown>): ServiceNotifier | undefined {
  const candidate = notifications?.service;

  if (!candidate || typeof candidate !== "object") {
    return undefined;
  }

  const notifier = candidate as Partial<ServiceNotifier>;

  if (typeof notifier.notifyServiceRequestCreated !== "function") {
    return undefined;
  }

  return notifier as ServiceNotifier;
}
