import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SubmitCommerceQuoteForReviewCommandInput { quoteId: string; submittedBy: string; }
export interface SubmitCommerceQuoteForReviewCommandDTO { id: string; workflow: "commerce-quote"; status: "HUMAN_REVIEW_REQUIRED"; command: "SubmitCommerceQuoteForReviewCommand"; }

export class SubmitCommerceQuoteForReviewCommand implements GovernedCommand<SubmitCommerceQuoteForReviewCommandInput, SubmitCommerceQuoteForReviewCommandDTO> {
  validateInput(input: SubmitCommerceQuoteForReviewCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.submittedBy) throw new Error("submittedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: SubmitCommerceQuoteForReviewCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.quote.submit_review"); }
  async executeMutation(input: SubmitCommerceQuoteForReviewCommandInput, context: CommandContext): Promise<SubmitCommerceQuoteForReviewCommandDTO> { void context; return { id: input.quoteId, workflow: "commerce-quote", status: "HUMAN_REVIEW_REQUIRED", command: "SubmitCommerceQuoteForReviewCommand" }; }
  async appendAuditEvent(actor: Actor, input: SubmitCommerceQuoteForReviewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SubmitCommerceQuoteForReviewCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "SubmitCommerceQuoteForReviewCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): SubmitCommerceQuoteForReviewCommandDTO { return mutationResult as SubmitCommerceQuoteForReviewCommandDTO; }
  async run(input: SubmitCommerceQuoteForReviewCommandInput, context: CommandContext): Promise<CommandResult<SubmitCommerceQuoteForReviewCommandDTO>> { return runGovernedCommand(this, input, context); }
}
