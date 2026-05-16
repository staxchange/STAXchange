import type { NotificationQueueItemDTO } from "./types";

export function createNotificationQueueItem(input: {
  id: string;
  channel: NotificationQueueItemDTO["channel"];
  templateId: string;
  recipient: string;
  payload: Record<string, unknown>;
}): NotificationQueueItemDTO {
  return {
    ...input,
    status: "QUEUED",
    createdAt: new Date().toISOString()
  };
}
