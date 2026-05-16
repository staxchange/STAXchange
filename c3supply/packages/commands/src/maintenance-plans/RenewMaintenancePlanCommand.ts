import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RenewMaintenancePlanCommandInput {
  maintenancePlanId: string;
  renewedBy: string;
}

export interface RenewMaintenancePlanCommandDTO {
  id: string;
  workflow: "maintenance-plan";
  status: "RENEWED";
  command: "RenewMaintenancePlanCommand";
}

export class RenewMaintenancePlanCommand implements GovernedCommand<RenewMaintenancePlanCommandInput, RenewMaintenancePlanCommandDTO> {
  validateInput(input: RenewMaintenancePlanCommandInput): void {
    if (!input.maintenancePlanId) throw new Error("maintenancePlanId is required.");
    if (!input.renewedBy) throw new Error("renewedBy is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RenewMaintenancePlanCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "maintenance.plan.renew");
  }

  async executeMutation(input: RenewMaintenancePlanCommandInput, context: CommandContext): Promise<RenewMaintenancePlanCommandDTO> {
    void context;
    return {
      id: input.maintenancePlanId,
      workflow: "maintenance-plan",
      status: "RENEWED",
      command: "RenewMaintenancePlanCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RenewMaintenancePlanCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RenewMaintenancePlanCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RenewMaintenancePlanCommand",
        workflow: "maintenance-plan",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RenewMaintenancePlanCommandDTO {
    return mutationResult as RenewMaintenancePlanCommandDTO;
  }

  async run(input: RenewMaintenancePlanCommandInput, context: CommandContext): Promise<CommandResult<RenewMaintenancePlanCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
