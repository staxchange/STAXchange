import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CancelMaintenancePlanCommandInput {
  maintenancePlanId: string;
  cancelledBy: string;
  reason: string;
}

export interface CancelMaintenancePlanCommandDTO {
  id: string;
  workflow: "maintenance-plan";
  status: "CANCELLED";
  command: "CancelMaintenancePlanCommand";
}

export class CancelMaintenancePlanCommand implements GovernedCommand<CancelMaintenancePlanCommandInput, CancelMaintenancePlanCommandDTO> {
  validateInput(input: CancelMaintenancePlanCommandInput): void {
    if (!input.maintenancePlanId) throw new Error("maintenancePlanId is required.");
    if (!input.cancelledBy) throw new Error("cancelledBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CancelMaintenancePlanCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "maintenance.plan.cancel");
  }

  async executeMutation(input: CancelMaintenancePlanCommandInput, context: CommandContext): Promise<CancelMaintenancePlanCommandDTO> {
    void context;
    return {
      id: input.maintenancePlanId,
      workflow: "maintenance-plan",
      status: "CANCELLED",
      command: "CancelMaintenancePlanCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CancelMaintenancePlanCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CancelMaintenancePlanCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CancelMaintenancePlanCommand",
        workflow: "maintenance-plan",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CancelMaintenancePlanCommandDTO {
    return mutationResult as CancelMaintenancePlanCommandDTO;
  }

  async run(input: CancelMaintenancePlanCommandInput, context: CommandContext): Promise<CommandResult<CancelMaintenancePlanCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
