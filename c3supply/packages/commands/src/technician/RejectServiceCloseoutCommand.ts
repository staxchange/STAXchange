import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RejectServiceCloseoutCommandInput { closeoutId: string; workOrderId: string; reviewerId: string; reason: string; }

export interface RejectServiceCloseoutCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "REJECTED";
  command: "RejectServiceCloseoutCommand";
}

export class RejectServiceCloseoutCommand implements GovernedCommand<RejectServiceCloseoutCommandInput, RejectServiceCloseoutCommandDTO> {
  validateInput(input: RejectServiceCloseoutCommandInput): void {
    if (!input.closeoutId) throw new Error("closeoutId is required.");
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.reviewerId) throw new Error("reviewerId is required.");
    if (!input.reason?.trim()) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RejectServiceCloseoutCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "manager.closeout.reject");
  }

  async executeMutation(input: RejectServiceCloseoutCommandInput, context: CommandContext): Promise<RejectServiceCloseoutCommandDTO> {
    void context;
    return {
      id: input.closeoutId,
      workflow: "technician-work-order",
      status: "REJECTED",
      command: "RejectServiceCloseoutCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: RejectServiceCloseoutCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RejectServiceCloseoutCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RejectServiceCloseoutCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, reviewerId: input.reviewerId, reason: input.reason }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RejectServiceCloseoutCommandDTO {
    return mutationResult as RejectServiceCloseoutCommandDTO;
  }

  async run(input: RejectServiceCloseoutCommandInput, context: CommandContext): Promise<CommandResult<RejectServiceCloseoutCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
