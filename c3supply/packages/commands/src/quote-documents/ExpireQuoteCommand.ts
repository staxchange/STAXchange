import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ExpireQuoteCommandInput { quoteDocumentId: string; expiredBy: string; reason?: string; }
export interface ExpireQuoteCommandDTO { id: string; workflow: "quote-document"; status: "EXPIRED"; command: "ExpireQuoteCommand"; }

export class ExpireQuoteCommand implements GovernedCommand<ExpireQuoteCommandInput, ExpireQuoteCommandDTO> {
  validateInput(input: ExpireQuoteCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.expiredBy) throw new Error("expiredBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ExpireQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.expire"); }
  async executeMutation(input: ExpireQuoteCommandInput, context: CommandContext): Promise<ExpireQuoteCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "EXPIRED", command: "ExpireQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: ExpireQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ExpireQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ExpireQuoteCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ExpireQuoteCommandDTO { return mutationResult as ExpireQuoteCommandDTO; }
  async run(input: ExpireQuoteCommandInput, context: CommandContext): Promise<CommandResult<ExpireQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
