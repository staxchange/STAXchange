import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ActivateMaintenancePlanCommandInput {
  maintenancePlanId: string;
  activatedBy: string;
}

export interface ActivateMaintenancePlanCommandDTO {
  id: string;
  workflow: "maintenance-plan";
  status: "ACTIVE";
  command: "ActivateMaintenancePlanCommand";
}

export class ActivateMaintenancePlanCommand implements GovernedCommand<ActivateMaintenancePlanCommandInput, ActivateMaintenancePlanCommandDTO> {
  validateInput(input: ActivateMaintenancePlanCommandInput): void {
    if (!input.maintenancePlanId) throw new Error("maintenancePlanId is required.");
    if (!input.activatedBy) throw new Error("activatedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ActivateMaintenancePlanCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "maintenance.plan.activate");
  }

  async executeMutation(input: ActivateMaintenancePlanCommandInput, context: CommandContext): Promise<ActivateMaintenancePlanCommandDTO> {
    void context;
    return {
      id: input.maintenancePlanId,
      workflow: "maintenance-plan",
      status: "ACTIVE",
      command: "ActivateMaintenancePlanCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ActivateMaintenancePlanCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ActivateMaintenancePlanCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ActivateMaintenancePlanCommand",
        workflow: "maintenance-plan",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ActivateMaintenancePlanCommandDTO {
    return mutationResult as ActivateMaintenancePlanCommandDTO;
  }

  async run(input: ActivateMaintenancePlanCommandInput, context: CommandContext): Promise<CommandResult<ActivateMaintenancePlanCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
