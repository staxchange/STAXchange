import type { ServiceStatusVisual } from "./types";

export function serviceStatusVisual(status: string): ServiceStatusVisual {
  const normalized = status.toUpperCase();

  if (normalized.includes("EMERGENCY") || normalized.includes("ESCALATED")) {
    return {
      status,
      label: "Urgent pressure",
      intensity: "critical",
      gaugePercent: 95
    };
  }

  if (normalized.includes("REVIEW") || normalized.includes("HUMAN")) {
    return {
      status,
      label: "Human review",
      intensity: "high",
      gaugePercent: 78
    };
  }

  if (normalized.includes("SCHEDULED") || normalized.includes("ASSIGNED")) {
    return {
      status,
      label: "Scheduled",
      intensity: "medium",
      gaugePercent: 54
    };
  }

  if (normalized.includes("COMPLETED") || normalized.includes("CLOSED")) {
    return {
      status,
      label: "Closed",
      intensity: "low",
      gaugePercent: 22
    };
  }

  return {
    status,
    label: "Intake",
    intensity: "medium",
    gaugePercent: 44
  };
}
