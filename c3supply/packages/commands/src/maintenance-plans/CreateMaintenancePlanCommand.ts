import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateMaintenancePlanCommandInput {
  customerId: string;
  treatmentSystemId?: string;
  frequency: "MONTHLY" | "QUARTERLY" | "SEMI_ANNUAL" | "ANNUAL";
}

export interface CreateMaintenancePlanCommandDTO {
  id: string;
  workflow: "maintenance-plan";
  status: "PLAN_CREATED";
  command: "CreateMaintenancePlanCommand";
}

export class CreateMaintenancePlanCommand implements GovernedCommand<CreateMaintenancePlanCommandInput, CreateMaintenancePlanCommandDTO> {
  validateInput(input: CreateMaintenancePlanCommandInput): void {
    if (!input.customerId) throw new Error("customerId is required.");
    if (!input.frequency) throw new Error("frequency is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateMaintenancePlanCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "maintenance.plan.create");
  }

  async executeMutation(input: CreateMaintenancePlanCommandInput, context: CommandContext): Promise<CreateMaintenancePlanCommandDTO> {
    void context;
    return {
      id: input.customerId,
      workflow: "maintenance-plan",
      status: "PLAN_CREATED",
      command: "CreateMaintenancePlanCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateMaintenancePlanCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateMaintenancePlanCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateMaintenancePlanCommand",
        workflow: "maintenance-plan",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateMaintenancePlanCommandDTO {
    return mutationResult as CreateMaintenancePlanCommandDTO;
  }

  async run(input: CreateMaintenancePlanCommandInput, context: CommandContext): Promise<CommandResult<CreateMaintenancePlanCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
