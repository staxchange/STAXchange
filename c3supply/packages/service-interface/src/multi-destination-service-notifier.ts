import type {
  EmergencyServiceEscalationInput,
  PersistedServiceRequestRecord,
  ServiceWorkOrderRecord
} from "./repository-contracts";
import type { ServiceNotificationResult, ServiceNotifier } from "./notification-contracts";

export interface MultiDestinationNotifierEnv {
  [key: string]: string | undefined;
  SERVICE_ESCALATION_WEBHOOK_URL?: string;
  SERVICE_TEAMS_WEBHOOK_URL?: string;
  SERVICE_EMAIL_WEBHOOK_URL?: string;
  SERVICE_CRM_WEBHOOK_URL?: string;
}

type NotificationEvent = "service_request_created" | "emergency_service_escalation" | "work_order_assigned";

export class MultiDestinationServiceNotifier implements ServiceNotifier {
  constructor(private readonly env: MultiDestinationNotifierEnv) {}

  async notifyServiceRequestCreated(record: PersistedServiceRequestRecord): Promise<ServiceNotificationResult> {
    return this.postAll("service_request_created", record);
  }

  async notifyEmergencyEscalation(input: EmergencyServiceEscalationInput): Promise<ServiceNotificationResult> {
    return this.postAll("emergency_service_escalation", input);
  }

  async notifyWorkOrderAssigned(record: ServiceWorkOrderRecord): Promise<ServiceNotificationResult> {
    return this.postAll("work_order_assigned", record);
  }

  private destinations(): Array<{ name: string; url: string }> {
    return [
      { name: "service", url: this.env.SERVICE_ESCALATION_WEBHOOK_URL ?? "" },
      { name: "teams", url: this.env.SERVICE_TEAMS_WEBHOOK_URL ?? "" },
      { name: "email", url: this.env.SERVICE_EMAIL_WEBHOOK_URL ?? "" },
      { name: "crm", url: this.env.SERVICE_CRM_WEBHOOK_URL ?? "" }
    ].filter((destination) => destination.url);
  }

  private async postAll(event: NotificationEvent, payload: unknown): Promise<ServiceNotificationResult> {
    const destinations = this.destinations();

    if (!destinations.length) {
      return { delivered: false, error: "No service notification destinations configured." };
    }

    const results = await Promise.all(
      destinations.map(async (destination) => {
        try {
          const response = await fetch(destination.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event,
              destination: destination.name,
              payload,
              createdAt: new Date().toISOString(),
              source: "DWG Treatment Service Interface"
            })
          });

          return {
            delivered: response.ok,
            destination: destination.name,
            error: response.ok ? undefined : `${destination.name} returned ${response.status}`
          } satisfies ServiceNotificationResult;
        } catch (error) {
          return {
            delivered: false,
            destination: destination.name,
            error: error instanceof Error ? error.message : "Unknown notification error."
          } satisfies ServiceNotificationResult;
        }
      })
    );

    const delivered = results.some((result) => result.delivered);

    return {
      delivered,
      destination: results.filter((result) => result.delivered).map((result) => result.destination).join(",") || undefined,
      error: delivered ? undefined : results.map((result) => result.error).filter(Boolean).join("; ")
    };
  }
}

export function createMultiDestinationServiceNotifier(env: MultiDestinationNotifierEnv): MultiDestinationServiceNotifier {
  return new MultiDestinationServiceNotifier(env);
}
