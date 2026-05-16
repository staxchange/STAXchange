import type { ActorRole } from "@stax/governance";

export interface WorkflowTransition {
  from: string;
  to: string;
  command: string;
  allowedRoles: ActorRole[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  initialStatus: string;
  terminalStatuses: string[];
  transitions: WorkflowTransition[];
}

export interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
}
