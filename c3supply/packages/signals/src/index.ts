export interface OperationalSignalDTO {
  id: string;
  label: string;
  count: number;
  readOnly: true;
}

export function assertReadOnlySignal(signal: OperationalSignalDTO): OperationalSignalDTO {
  return { ...signal, readOnly: true };
}

export const signalsAreDownstreamOnly = true;
