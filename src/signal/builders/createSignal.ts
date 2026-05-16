import { StructuredObservation } from '../../structure';
import { Signal, SignalDirection } from '../signal.types';

export function createSignal(
  observation: StructuredObservation,
  signal_type: string,
  direction: SignalDirection,
  strength: number
): Signal {
  return {
    signal_id: generateSignalId(),
    asset_id: observation.asset_id,
    observation_id: observation.observation_id,
    created_at: Date.now(),

    signal_type,
    direction,
    strength,

    source: {
      layer: 'signal',
      derived_from: observation.observation_id,
    },

    metadata: {},
  };
}

function generateSignalId(): string {
  return `signal_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}