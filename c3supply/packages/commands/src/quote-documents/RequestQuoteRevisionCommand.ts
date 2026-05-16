import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RequestQuoteRevisionCommandInput { quoteDocumentId: string; requestedBy: string; reason: string; }
export interface RequestQuoteRevisionCommandDTO { id: string; workflow: "quote-document"; status: "REVISION_REQUESTED"; command: "RequestQuoteRevisionCommand"; }

export class RequestQuoteRevisionCommand implements GovernedCommand<RequestQuoteRevisionCommandInput, RequestQuoteRevisionCommandDTO> {
  validateInput(input: RequestQuoteRevisionCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.requestedBy) throw new Error("requestedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RequestQuoteRevisionCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.revision.request"); }
  async executeMutation(input: RequestQuoteRevisionCommandInput, context: CommandContext): Promise<RequestQuoteRevisionCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "REVISION_REQUESTED", command: "RequestQuoteRevisionCommand" }; }
  async appendAuditEvent(actor: Actor, input: RequestQuoteRevisionCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RequestQuoteRevisionCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RequestQuoteRevisionCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RequestQuoteRevisionCommandDTO { return mutationResult as RequestQuoteRevisionCommandDTO; }
  async run(input: RequestQuoteRevisionCommandInput, context: CommandContext): Promise<CommandResult<RequestQuoteRevisionCommandDTO>> { return runGovernedCommand(this, input, context); }
}
