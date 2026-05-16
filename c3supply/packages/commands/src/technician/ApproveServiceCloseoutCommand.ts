import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApproveServiceCloseoutCommandInput { closeoutId: string; workOrderId: string; reviewerId: string; }

export interface ApproveServiceCloseoutCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "APPROVED";
  command: "ApproveServiceCloseoutCommand";
}

export class ApproveServiceCloseoutCommand implements GovernedCommand<ApproveServiceCloseoutCommandInput, ApproveServiceCloseoutCommandDTO> {
  validateInput(input: ApproveServiceCloseoutCommandInput): void {
    if (!input.closeoutId) throw new Error("closeoutId is required.");
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.reviewerId) throw new Error("reviewerId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: ApproveServiceCloseoutCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "manager.closeout.approve");
  }

  async executeMutation(input: ApproveServiceCloseoutCommandInput, context: CommandContext): Promise<ApproveServiceCloseoutCommandDTO> {
    void context;
    return {
      id: input.closeoutId,
      workflow: "technician-work-order",
      status: "APPROVED",
      command: "ApproveServiceCloseoutCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: ApproveServiceCloseoutCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ApproveServiceCloseoutCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "ApproveServiceCloseoutCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, reviewerId: input.reviewerId }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): ApproveServiceCloseoutCommandDTO {
    return mutationResult as ApproveServiceCloseoutCommandDTO;
  }

  async run(input: ApproveServiceCloseoutCommandInput, context: CommandContext): Promise<CommandResult<ApproveServiceCloseoutCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
