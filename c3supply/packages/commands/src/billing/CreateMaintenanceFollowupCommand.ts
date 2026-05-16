import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateMaintenanceFollowupCommandInput {
  workOrderId: string;
  reason: string;
  targetDate?: string;
}

export interface CreateMaintenanceFollowupCommandDTO {
  id: string;
  workflow: "service-billing";
  status: "FOLLOWUP_CREATED";
  command: "CreateMaintenanceFollowupCommand";
}

export class CreateMaintenanceFollowupCommand implements GovernedCommand<CreateMaintenanceFollowupCommandInput, CreateMaintenanceFollowupCommandDTO> {
  validateInput(input: CreateMaintenanceFollowupCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CreateMaintenanceFollowupCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "maintenance.followup.create");
  }

  async executeMutation(input: CreateMaintenanceFollowupCommandInput, context: CommandContext): Promise<CreateMaintenanceFollowupCommandDTO> {
    void context;
    // Placeholder only. Production billing mutation belongs here and nowhere in apps/*.
    return {
      id: input.workOrderId,
      workflow: "service-billing",
      status: "FOLLOWUP_CREATED",
      command: "CreateMaintenanceFollowupCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: CreateMaintenanceFollowupCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as CreateMaintenanceFollowupCommandDTO;

    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CreateMaintenanceFollowupCommand",
        workflow: "service-billing",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CreateMaintenanceFollowupCommandDTO {
    return mutationResult as CreateMaintenanceFollowupCommandDTO;
  }

  async run(input: CreateMaintenanceFollowupCommandInput, context: CommandContext): Promise<CommandResult<CreateMaintenanceFollowupCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
