export interface StructuredAsset {
  asset_id: string;
  ingest_event_id: string;
  structured_at: number;

  identity: {
    primary_label?: string;
    secondary_label?: string;
    category?: string;
    subcategory?: string;
  };

  raw_reference: {
    source_id: string;
    source_type: string;
  };

  extracted_fields: Record<string, unknown>;
}

export interface StructuredObservation {
  observation_id: string;
  asset_id: string;
  created_at: number;

  observation_type: string;
  value: unknown;

  metadata?: {
    source?: string;
    confidence_hint?: number;
    notes?: string;
  };
}