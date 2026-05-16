import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuditEventDTO, AuditSink } from "@stax/audit";

export class SupabaseAuditSink implements AuditSink {
  constructor(private readonly supabase: SupabaseClient) {}

  async append(event: AuditEventDTO): Promise<void> {
    const { error } = await this.supabase.from("audit_events").insert({
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

    if (error) {
      throw new Error(`SupabaseAuditSink.append: ${error.message}`);
    }
  }
}

export function createSupabaseAuditSink(supabase: SupabaseClient): SupabaseAuditSink {
  return new SupabaseAuditSink(supabase);
}
