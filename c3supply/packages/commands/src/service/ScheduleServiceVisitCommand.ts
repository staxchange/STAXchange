import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";
import { serviceNotifierFromContext, serviceRepositoryFromContext } from "./service-adapters";

export interface ScheduleServiceVisitCommandInput {
  workOrderId: string;
  scheduledStart: string;
  scheduledEnd?: string;
  siteAccessNotes?: string;
}

export interface ScheduleServiceVisitCommandDTO {
  id: string;
  workflow: "treatment-system-service";
  status: "SCHEDULED";
  command: "ScheduleServiceVisitCommand";
}

export class ScheduleServiceVisitCommand implements GovernedCommand<ScheduleServiceVisitCommandInput, ScheduleServiceVisitCommandDTO> {
  validateInput(input: ScheduleServiceVisitCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.scheduledStart) throw new Error("scheduledStart is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ScheduleServiceVisitCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "service.visit.schedule");
  }

  async executeMutation(input: ScheduleServiceVisitCommandInput, context: CommandContext): Promise<ScheduleServiceVisitCommandDTO> {
    const repository = serviceRepositoryFromContext(context);
    if (repository) await repository.scheduleServiceVisit({ ...input, requestId: context.requestId });

    return {
      id: input.workOrderId,
      workflow: "treatment-system-service",
      status: "SCHEDULED",
      command: "ScheduleServiceVisitCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: ScheduleServiceVisitCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    void mutationResult;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ScheduleServiceVisitCommand",
        workflow: "treatment-system-service",
        entityId: input.workOrderId,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { scheduledStart: input.scheduledStart, scheduledEnd: input.scheduledEnd }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ScheduleServiceVisitCommandDTO {
    return mutationResult as ScheduleServiceVisitCommandDTO;
  }

  async run(input: ScheduleServiceVisitCommandInput, context: CommandContext): Promise<CommandResult<ScheduleServiceVisitCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
