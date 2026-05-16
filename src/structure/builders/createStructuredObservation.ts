import type { StructuredObservation } from '../structure.types';

export interface CreateStructuredObservationInput {
  observation_id: string;
  asset_id: string;
  created_at: number;
  observation_type: string;
  value: unknown;
  metadata?: StructuredObservation['metadata'];
}

export const createStructuredObservation = (
  input: CreateStructuredObservationInput,
): StructuredObservation => ({
  observation_id: input.observation_id,
  asset_id: input.asset_id,
  created_at: input.created_at,
  observation_type: input.observation_type,
  value: input.value,
  ...(input.metadata ? { metadata: input.metadata } : {}),
});