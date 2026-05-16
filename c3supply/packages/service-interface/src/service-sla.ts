import type { ServiceClassification } from "./types";

export interface ServiceSLA {
  label: string;
  targetResponseHours: number;
  dispatchPriority: number;
}

export function serviceSLAForClassification(classification: ServiceClassification): ServiceSLA {
  if (classification.severity === "EMERGENCY") {
    return {
      label: "Emergency service review",
      targetResponseHours: 1,
      dispatchPriority: 1
    };
  }

  if (classification.severity === "HIGH") {
    return {
      label: "Priority service review",
      targetResponseHours: 4,
      dispatchPriority: 2
    };
  }

  if (classification.severity === "MEDIUM") {
    return {
      label: "Standard service review",
      targetResponseHours: 24,
      dispatchPriority: 3
    };
  }

  return {
    label: "Routine service review",
    targetResponseHours: 48,
    dispatchPriority: 4
  };
}
