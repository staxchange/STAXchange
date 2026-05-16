import type { AuditEventDTO } from "./audit-event";

export interface AuditSink {
  append(event: AuditEventDTO): Promise<void>;
}

export async function appendAuditEvent(event: AuditEventDTO, sink?: AuditSink): Promise<void> {
  if (sink) {
    await sink.append(event);
    return;
  }

  // Placeholder only. Production appends immutable audit rows.
  void event;
}
