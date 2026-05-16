import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApproveCommerceQuoteCommandInput { quoteId: string; approvedBy: string; humanReviewCompleted: boolean; }
export interface ApproveCommerceQuoteCommandDTO { id: string; workflow: "commerce-quote"; status: "QUOTE_APPROVED"; command: "ApproveCommerceQuoteCommand"; }

export class ApproveCommerceQuoteCommand implements GovernedCommand<ApproveCommerceQuoteCommandInput, ApproveCommerceQuoteCommandDTO> {
  validateInput(input: ApproveCommerceQuoteCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.approvedBy) throw new Error("approvedBy is required.");
    if (!input.humanReviewCompleted) throw new Error("humanReviewCompleted is required before quote approval.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ApproveCommerceQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.quote.approve"); }
  async executeMutation(input: ApproveCommerceQuoteCommandInput, context: CommandContext): Promise<ApproveCommerceQuoteCommandDTO> { void context; return { id: input.quoteId, workflow: "commerce-quote", status: "QUOTE_APPROVED", command: "ApproveCommerceQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: ApproveCommerceQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ApproveCommerceQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ApproveCommerceQuoteCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ApproveCommerceQuoteCommandDTO { return mutationResult as ApproveCommerceQuoteCommandDTO; }
  async run(input: ApproveCommerceQuoteCommandInput, context: CommandContext): Promise<CommandResult<ApproveCommerceQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
