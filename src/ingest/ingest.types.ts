export type IngestSourceType =
  | 'camera'
  | 'upload'
  | 'api'
  | 'manual';

export interface RawIngestData {
  id: string;
  source_type: IngestSourceType;
  timestamp: number;

  payload: unknown;

  metadata?: {
    filename?: string;
    mime_type?: string;
    size_bytes?: number;

    device_info?: {
      device_id?: string;
      model?: string;
      os?: string;
    };

    capture_context?: {
      location?: string;
      lighting?: string;
      motion?: string;
    };
  };
}

export interface IngestEvent {
  event_id: string;
  created_at: number;

  data: RawIngestData;

  integrity: {
    checksum?: string;
    is_complete: boolean;
  };
}