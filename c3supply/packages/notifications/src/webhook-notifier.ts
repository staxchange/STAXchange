import type { NotificationDispatchResult, NotificationQueueItemDTO } from "./types";

export async function sendWebhookNotification(
  item: NotificationQueueItemDTO,
  webhookUrl?: string
): Promise<NotificationDispatchResult> {
  if (!webhookUrl) {
    return {
      ok: false,
      channel: item.channel,
      error: "Webhook URL is not configured."
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });

  return {
    ok: response.ok,
    channel: item.channel,
    providerMessageId: response.ok ? item.id : undefined,
    error: response.ok ? undefined : `Webhook failed with status ${response.status}`
  };
}
