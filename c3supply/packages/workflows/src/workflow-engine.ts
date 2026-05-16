import type { ActorRole } from "@stax/governance";
import type { WorkflowDefinition } from "./workflow-types";

export function canTransition(
  workflow: WorkflowDefinition,
  from: string,
  to: string,
  actorRole: ActorRole
): boolean {
  return workflow.transitions.some(
    (transition) =>
      transition.from === from &&
      transition.to === to &&
      transition.allowedRoles.includes(actorRole)
  );
}

export function nextStatuses(workflow: WorkflowDefinition, from: string): string[] {
  return workflow.transitions
    .filter((transition) => transition.from === from)
    .map((transition) => transition.to);
}
