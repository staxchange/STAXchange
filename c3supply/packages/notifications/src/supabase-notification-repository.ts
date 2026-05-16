import type { NotificationDispatchResult, NotificationQueueItemDTO } from "./types";

interface SupabaseLikeClient {
  from(table: string): {
    insert(value: unknown): { select(columns?: string): { single(): Promise<{ data: unknown; error: { message: string } | null }> } };
    update(value: unknown): { eq(column: string, value: unknown): { select(columns?: string): { single(): Promise<{ data: unknown; error: { message: string } | null }> } } };
  };
}

function assertOk(error: { message?: string } | null | undefined, action: string): void {
  if (error) throw new Error(`${action}: ${error.message ?? "Supabase error"}`);
}

export class SupabaseNotificationRepository {
  constructor(private readonly supabase: SupabaseLikeClient) {}

  async queueNotification(item: NotificationQueueItemDTO): Promise<NotificationQueueItemDTO> {
    const { data, error } = await this.supabase
      .from("notification_queue")
      .insert({
        id: item.id,
        channel: item.channel,
        template_id: item.templateId,
        recipient: item.recipient,
        payload: item.payload,
        status: item.status
      })
      .select("*")
      .single();
    assertOk(error, "queueNotification");
    void data;
    return item;
  }

  async recordDispatchResult(notificationId: string, result: NotificationDispatchResult): Promise<void> {
    const { error } = await this.supabase
      .from("notification_dispatch_events")
      .insert({
        notification_id: notificationId,
        status: result.ok ? "SENT" : "FAILED",
        provider_message_id: result.providerMessageId ?? null,
        error: result.error ?? null
      })
      .select("*")
      .single();
    assertOk(error, "recordDispatchResult");
  }
}
