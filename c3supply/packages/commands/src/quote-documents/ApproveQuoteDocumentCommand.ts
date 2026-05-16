import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApproveQuoteDocumentCommandInput { quoteDocumentId: string; approvedBy: string; humanReviewCompleted: boolean; }
export interface ApproveQuoteDocumentCommandDTO { id: string; workflow: "quote-document"; status: "DOCUMENT_APPROVED"; command: "ApproveQuoteDocumentCommand"; }

export class ApproveQuoteDocumentCommand implements GovernedCommand<ApproveQuoteDocumentCommandInput, ApproveQuoteDocumentCommandDTO> {
  validateInput(input: ApproveQuoteDocumentCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.approvedBy) throw new Error("approvedBy is required.");
    if (!input.humanReviewCompleted) throw new Error("humanReviewCompleted is required before document approval.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ApproveQuoteDocumentCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.approve"); }
  async executeMutation(input: ApproveQuoteDocumentCommandInput, context: CommandContext): Promise<ApproveQuoteDocumentCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "DOCUMENT_APPROVED", command: "ApproveQuoteDocumentCommand" }; }
  async appendAuditEvent(actor: Actor, input: ApproveQuoteDocumentCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ApproveQuoteDocumentCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ApproveQuoteDocumentCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ApproveQuoteDocumentCommandDTO { return mutationResult as ApproveQuoteDocumentCommandDTO; }
  async run(input: ApproveQuoteDocumentCommandInput, context: CommandContext): Promise<CommandResult<ApproveQuoteDocumentCommandDTO>> { return runGovernedCommand(this, input, context); }
}
