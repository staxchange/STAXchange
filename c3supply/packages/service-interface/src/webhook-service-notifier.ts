import type { EmergencyServiceEscalationInput, PersistedServiceRequestRecord, ServiceWorkOrderRecord } from "./repository-contracts";
import type { ServiceNotificationResult, ServiceNotifier } from "./notification-contracts";

export class WebhookServiceNotifier implements ServiceNotifier {
  constructor(private readonly webhookUrl?: string) {}

  async notifyServiceRequestCreated(record: PersistedServiceRequestRecord): Promise<ServiceNotificationResult> {
    return this.post("service_request_created", record);
  }

  async notifyEmergencyEscalation(input: EmergencyServiceEscalationInput): Promise<ServiceNotificationResult> {
    return this.post("emergency_service_escalation", input);
  }

  async notifyWorkOrderAssigned(record: ServiceWorkOrderRecord): Promise<ServiceNotificationResult> {
    return this.post("work_order_assigned", record);
  }

  private async post(event: string, payload: unknown): Promise<ServiceNotificationResult> {
    if (!this.webhookUrl) {
      return { delivered: false, error: "SERVICE_ESCALATION_WEBHOOK_URL is not configured." };
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, payload, createdAt: new Date().toISOString() })
      });

      return {
        delivered: response.ok,
        destination: this.webhookUrl,
        error: response.ok ? undefined : `Webhook returned ${response.status}`
      };
    } catch (error) {
      return {
        delivered: false,
        destination: this.webhookUrl,
        error: error instanceof Error ? error.message : "Unknown webhook error."
      };
    }
  }
}

export function createWebhookServiceNotifier(webhookUrl?: string): WebhookServiceNotifier {
  return new WebhookServiceNotifier(webhookUrl);
}
