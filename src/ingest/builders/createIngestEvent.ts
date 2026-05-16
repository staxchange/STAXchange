import type { IngestEvent, RawIngestData } from '../ingest.types';

export interface CreateIngestEventInput {
  event_id: string;
  created_at: number;
  data: RawIngestData;
  integrity?: IngestEvent['integrity'];
}

export const createIngestEvent = (
  input: CreateIngestEventInput,
): IngestEvent => ({
  event_id: input.event_id,
  created_at: input.created_at,
  data: input.data,
  integrity: {
    is_complete: input.integrity?.is_complete ?? true,
    ...(input.integrity?.checksum
      ? { checksum: input.integrity.checksum }
      : {}),
  },
});