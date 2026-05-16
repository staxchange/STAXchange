import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ScheduleMaintenancePlanVisitCommandInput {
  maintenancePlanId: string;
  scheduledAt: string;
  workOrderId?: string;
}

export interface ScheduleMaintenancePlanVisitCommandDTO {
  id: string;
  workflow: "maintenance-plan";
  status: "VISIT_SCHEDULED";
  command: "ScheduleMaintenancePlanVisitCommand";
}

export class ScheduleMaintenancePlanVisitCommand implements GovernedCommand<ScheduleMaintenancePlanVisitCommandInput, ScheduleMaintenancePlanVisitCommandDTO> {
  validateInput(input: ScheduleMaintenancePlanVisitCommandInput): void {
    if (!input.maintenancePlanId) throw new Error("maintenancePlanId is required.");
    if (!input.scheduledAt) throw new Error("scheduledAt is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ScheduleMaintenancePlanVisitCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "maintenance.plan.visit.schedule");
  }

  async executeMutation(input: ScheduleMaintenancePlanVisitCommandInput, context: CommandContext): Promise<ScheduleMaintenancePlanVisitCommandDTO> {
    void context;
    return {
      id: input.maintenancePlanId,
      workflow: "maintenance-plan",
      status: "VISIT_SCHEDULED",
      command: "ScheduleMaintenancePlanVisitCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: ScheduleMaintenancePlanVisitCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as ScheduleMaintenancePlanVisitCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ScheduleMaintenancePlanVisitCommand",
        workflow: "maintenance-plan",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ScheduleMaintenancePlanVisitCommandDTO {
    return mutationResult as ScheduleMaintenancePlanVisitCommandDTO;
  }

  async run(input: ScheduleMaintenancePlanVisitCommandInput, context: CommandContext): Promise<CommandResult<ScheduleMaintenancePlanVisitCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
