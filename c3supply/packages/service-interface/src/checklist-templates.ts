import type { ServiceIssueCategory } from "./types";

export interface ServiceChecklistItem {
  id: string;
  label: string;
  requiresHumanTechnician: true;
}

export function checklistForCategory(category: ServiceIssueCategory): ServiceChecklistItem[] {
  const common: ServiceChecklistItem[] = [
    { id: "confirm-site", label: "Confirm service location and access notes.", requiresHumanTechnician: true },
    { id: "confirm-system", label: "Confirm system model, serial number, and configuration.", requiresHumanTechnician: true },
    { id: "document-findings", label: "Document findings and customer-approved next steps.", requiresHumanTechnician: true }
  ];

  if (category === "LEAK" || category === "FLOOD_RISK") {
    return [
      { id: "safety-first", label: "Confirm active water damage risk and make-safe status.", requiresHumanTechnician: true },
      { id: "isolate", label: "Verify isolation/shutoff status with customer or technician.", requiresHumanTechnician: true },
      ...common
    ];
  }

  if (category === "CHEMICAL_FEED" || category === "ELECTRICAL") {
    return [
      { id: "hazard-review", label: "Escalate hazard review before service advice.", requiresHumanTechnician: true },
      ...common
    ];
  }

  return common;
}
