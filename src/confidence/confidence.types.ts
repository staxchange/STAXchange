export interface ConfidenceComponent {
  name: string;
  score: number;
  weight: number;
}

export interface Confidence {
  confidence_id: string;
  asset_id: string;
  signal_id?: string;
  created_at: number;

  components: ConfidenceComponent[];

  total_score: number;

  source: {
    layer: 'confidence';
    derived_from: string;
  };

  metadata?: Record<string, unknown>;
}