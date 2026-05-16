import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RequestManagerReviewCommandInput { closeoutId: string; workOrderId: string; reason: string; }

export interface RequestManagerReviewCommandDTO {
  id: string;
  workflow: "technician-work-order";
  status: "MANAGER_REVIEW_REQUIRED";
  command: "RequestManagerReviewCommand";
}

export class RequestManagerReviewCommand implements GovernedCommand<RequestManagerReviewCommandInput, RequestManagerReviewCommandDTO> {
  validateInput(input: RequestManagerReviewCommandInput): void {
    if (!input.closeoutId) throw new Error("closeoutId is required.");
    if (!input.workOrderId) throw new Error("workOrderId is required.");
    if (!input.reason?.trim()) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RequestManagerReviewCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "manager.closeout.review");
  }

  async executeMutation(input: RequestManagerReviewCommandInput, context: CommandContext): Promise<RequestManagerReviewCommandDTO> {
    void context;
    return {
      id: input.closeoutId,
      workflow: "technician-work-order",
      status: "MANAGER_REVIEW_REQUIRED",
      command: "RequestManagerReviewCommand"
    };
  }

  async appendAuditEvent(actor: Actor, input: RequestManagerReviewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RequestManagerReviewCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RequestManagerReviewCommand",
        workflow: "technician-work-order",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { workOrderId: input.workOrderId, reason: input.reason }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RequestManagerReviewCommandDTO {
    return mutationResult as RequestManagerReviewCommandDTO;
  }

  async run(input: RequestManagerReviewCommandInput, context: CommandContext): Promise<CommandResult<RequestManagerReviewCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
