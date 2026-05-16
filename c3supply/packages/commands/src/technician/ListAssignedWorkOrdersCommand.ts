import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ListAssignedWorkOrdersCommandInput { technicianId: string; }

export interface ListAssignedWorkOrdersCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "ASSIGNED_WORK_ORDERS_LISTED";
  command: "ListAssignedWorkOrdersCommand";
}

export class ListAssignedWorkOrdersCommand implements GovernedCommand<ListAssignedWorkOrdersCommandInput, ListAssignedWorkOrdersCommandDTO> {
  validateInput(input: ListAssignedWorkOrdersCommandInput): void {
    if (!input.technicianId) throw new Error("technicianId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ListAssignedWorkOrdersCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "technician.work_orders.list");
  }

  async executeMutation(input: ListAssignedWorkOrdersCommandInput, context: CommandContext): Promise<ListAssignedWorkOrdersCommandDTO> {
    void context;
    return {
      id: input.technicianId,
      workflow: "technician-work-order",
      status: "ASSIGNED_WORK_ORDERS_LISTED",
      command: "ListAssignedWorkOrdersCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: ListAssignedWorkOrdersCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ListAssignedWorkOrdersCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ListAssignedWorkOrdersCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { technicianId: input.technicianId }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ListAssignedWorkOrdersCommandDTO {
    return mutationResult as ListAssignedWorkOrdersCommandDTO;
  }

  async run(input: ListAssignedWorkOrdersCommandInput, context: CommandContext): Promise<CommandResult<ListAssignedWorkOrdersCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
