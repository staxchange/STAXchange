import type { ExportHistoryEventDTO } from "./types";

export function createExportHistoryEvent(input: {
  batchId: string;
  eventType: ExportHistoryEventDTO["eventType"];
  actorId: string;
  note?: string;
}): ExportHistoryEventDTO {
  return {
    id: `export-history-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    batchId: input.batchId,
    eventType: input.eventType,
    actorId: input.actorId,
    note: input.note,
    createdAt: new Date().toISOString()
  };
}
