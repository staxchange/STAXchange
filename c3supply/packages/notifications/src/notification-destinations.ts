import { createHmac } from "node:crypto";
import type { NotificationDispatchResult, NotificationQueueItemDTO } from "./types";

export type NotificationDestinationKind = "TEAMS" | "EMAIL" | "CRM_WEBHOOK";

export interface NotificationDestinationDTO {
  kind: NotificationDestinationKind;
  webhookUrl?: string;
  sharedSecret?: string;
}

export function signNotificationPayload(payload: string, sharedSecret?: string): string | undefined {
  if (!sharedSecret) return undefined;
  return createHmac("sha256", sharedSecret).update(payload).digest("hex");
}

export async function dispatchToDestination(
  item: NotificationQueueItemDTO,
  destination: NotificationDestinationDTO
): Promise<NotificationDispatchResult> {
  if (!destination.webhookUrl) {
    return { ok: false, channel: item.channel, error: `${destination.kind} webhook URL is not configured.` };
  }

  const payload = JSON.stringify({ destination: destination.kind, item });
  const signature = signNotificationPayload(payload, destination.sharedSecret);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (signature) headers["X-STAX-Signature"] = signature;

  const response = await fetch(destination.webhookUrl, {
    method: "POST",
    headers,
    body: payload
  });

  return {
    ok: response.ok,
    channel: item.channel,
    providerMessageId: response.ok ? item.id : undefined,
    error: response.ok ? undefined : `${destination.kind} dispatch failed with ${response.status}`
  };
}
