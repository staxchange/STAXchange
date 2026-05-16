import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RequestPhotoQuoteHumanReviewCommandInput {
  intakeId: string;
  requestedBy: string;
  reason: string;
}

export interface RequestPhotoQuoteHumanReviewCommandDTO {
  id: string;
  workflow: "photo-quote";
  status: "HUMAN_REVIEW_REQUIRED";
  command: "RequestPhotoQuoteHumanReviewCommand";
}

export class RequestPhotoQuoteHumanReviewCommand implements GovernedCommand<RequestPhotoQuoteHumanReviewCommandInput, RequestPhotoQuoteHumanReviewCommandDTO> {
  validateInput(input: RequestPhotoQuoteHumanReviewCommandInput): void {
    if (!input.intakeId) throw new Error("intakeId is required.");
    if (!input.requestedBy) throw new Error("requestedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: RequestPhotoQuoteHumanReviewCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "photo_quote.review.request");
  }

  async executeMutation(input: RequestPhotoQuoteHumanReviewCommandInput, context: CommandContext): Promise<RequestPhotoQuoteHumanReviewCommandDTO> {
    void context;
    return {
      id: ("intakeId" in input && typeof input.intakeId === "string") ? input.intakeId : crypto.randomUUID(),
      workflow: "photo-quote",
      status: "HUMAN_REVIEW_REQUIRED",
      command: "RequestPhotoQuoteHumanReviewCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: RequestPhotoQuoteHumanReviewCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    const result = mutationResult as RequestPhotoQuoteHumanReviewCommandDTO;
    await appendAudit(
      {
        id: crypto.randomUUID(),
        actorId: actor.id,
        actorRole: actor.role,
        action: "RequestPhotoQuoteHumanReviewCommand",
        workflow: "photo-quote",
        entityId: result.id,
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): RequestPhotoQuoteHumanReviewCommandDTO {
    return mutationResult as RequestPhotoQuoteHumanReviewCommandDTO;
  }

  async run(input: RequestPhotoQuoteHumanReviewCommandInput, context: CommandContext): Promise<CommandResult<RequestPhotoQuoteHumanReviewCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
