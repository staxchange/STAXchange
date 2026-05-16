import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";
import { serviceNotifierFromContext, serviceRepositoryFromContext } from "./service-adapters";

export interface CompleteServiceVisitCommandInput {
  workOrderId: string;
  technicianId: string;
  findings: string;
  actionsTaken: string;
  followUpRequired?: boolean;
}

export interface CompleteServiceVisitCommandDTO {
  id: string;
  workflow: "treatment-system-service";
  status: "COMPLETED";
  command: "CompleteServiceVisitCommand";
}

export class CompleteServiceVisitCommand implements GovernedCommand<CompleteServiceVisitCommandInput, CompleteServiceVisitCommandDTO> {
  validateInput(input: CompleteServiceVisitCommandInput): void {
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.technicianId) throw new Error("technicianId is required.");
    if (!input.findings?.trim()) throw new Error("findings are required.");
    if (!input.actionsTaken?.trim()) throw new Error("actionsTaken is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: CompleteServiceVisitCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "service.visit.complete");
  }

  async executeMutation(input: CompleteServiceVisitCommandInput, context: CommandContext): Promise<CompleteServiceVisitCommandDTO> {
    const repository = serviceRepositoryFromContext(context);
    if (repository) await repository.completeServiceVisit({ ...input, requestId: context.requestId });

    return {
      id: input.workOrderId,
      workflow: "treatment-system-service",
      status: "COMPLETED",
      command: "CompleteServiceVisitCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: CompleteServiceVisitCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    void mutationResult;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "CompleteServiceVisitCommand",
        workflow: "treatment-system-service",
        entityId: input.workOrderId,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { technicianId: input.technicianId, followUpRequired: input.followUpRequired }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): CompleteServiceVisitCommandDTO {
    return mutationResult as CompleteServiceVisitCommandDTO;
  }

  async run(input: CompleteServiceVisitCommandInput, context: CommandContext): Promise<CommandResult<CompleteServiceVisitCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
