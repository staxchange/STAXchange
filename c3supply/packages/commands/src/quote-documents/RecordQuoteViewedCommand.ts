import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordQuoteViewedCommandInput { quoteDocumentId: string; viewerId?: string; token?: string; }
export interface RecordQuoteViewedCommandDTO { id: string; workflow: "quote-document"; status: "QUOTE_VIEWED"; command: "RecordQuoteViewedCommand"; }

export class RecordQuoteViewedCommand implements GovernedCommand<RecordQuoteViewedCommandInput, RecordQuoteViewedCommandDTO> {
  validateInput(input: RecordQuoteViewedCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordQuoteViewedCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.view.record"); }
  async executeMutation(input: RecordQuoteViewedCommandInput, context: CommandContext): Promise<RecordQuoteViewedCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "QUOTE_VIEWED", command: "RecordQuoteViewedCommand" }; }
  async appendAuditEvent(actor: Actor, input: RecordQuoteViewedCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordQuoteViewedCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordQuoteViewedCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordQuoteViewedCommandDTO { return mutationResult as RecordQuoteViewedCommandDTO; }
  async run(input: RecordQuoteViewedCommandInput, context: CommandContext): Promise<CommandResult<RecordQuoteViewedCommandDTO>> { return runGovernedCommand(this, input, context); }
}
