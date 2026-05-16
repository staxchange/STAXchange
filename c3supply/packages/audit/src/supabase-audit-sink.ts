import type { AuditEventDTO } from "./audit-event";
import type { AuditSink } from "./append-audit-event";

interface SupabaseLikeClient {
  from(table: string): {
    insert(value: unknown): Promise<{ data?: unknown; error: { message: string } | null }> | {
      select(columns?: string): { single(): Promise<{ data: unknown; error: { message: string } | null }> };
    };
  };
}

export class SupabaseAuditSink implements AuditSink {
  constructor(private readonly supabase: SupabaseLikeClient) {}

  async append(event: AuditEventDTO): Promise<void> {
    if (!event.actorId) throw new Error("audit actorId is required.");
    if (!event.actorRole) throw new Error("audit actorRole is required.");
    if (!event.action) throw new Error("audit action is required.");
    if (!event.workflow) throw new Error("audit workflow is required.");
    if (!event.createdAt) throw new Error("audit createdAt is required.");

    const result = this.supabase.from("audit_events").insert({
      id: event.id,
      actor_id: event.actorId,
      actor_role: event.actorRole,
      action: event.action,
      workflow: event.workflow,
      entity_id: event.entityId ?? null,
      request_id: event.requestId ?? null,
      metadata: event.metadata ?? {},
      created_at: event.createdAt
    });

    const resolved = typeof (result as Promise<unknown>).then === "function"
      ? await (result as Promise<{ error: { message: string } | null }>)
      : await (result as { select(columns?: string): { single(): Promise<{ error: { message: string } | null }> } }).select("*").single();

    if (resolved.error) throw new Error(resolved.error.message);
  }
}
