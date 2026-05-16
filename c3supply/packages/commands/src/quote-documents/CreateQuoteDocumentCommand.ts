import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateQuoteDocumentCommandInput { commerceQuoteId: string; approvedCommerceQuote: boolean; customerName: string; }
export interface CreateQuoteDocumentCommandDTO { id: string; workflow: "quote-document"; status: "DOCUMENT_DRAFTED"; command: "CreateQuoteDocumentCommand"; }

export class CreateQuoteDocumentCommand implements GovernedCommand<CreateQuoteDocumentCommandInput, CreateQuoteDocumentCommandDTO> {
  validateInput(input: CreateQuoteDocumentCommandInput): void {
    if (!input.commerceQuoteId) throw new Error("commerceQuoteId is required.");
    if (!input.customerName) throw new Error("customerName is required.");
    if (!input.approvedCommerceQuote) throw new Error("approvedCommerceQuote is required before quote document creation.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateQuoteDocumentCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.create"); }
  async executeMutation(input: CreateQuoteDocumentCommandInput, context: CommandContext): Promise<CreateQuoteDocumentCommandDTO> { void context; return { id: crypto.randomUUID(), workflow: "quote-document", status: "DOCUMENT_DRAFTED", command: "CreateQuoteDocumentCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateQuoteDocumentCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateQuoteDocumentCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateQuoteDocumentCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateQuoteDocumentCommandDTO { return mutationResult as CreateQuoteDocumentCommandDTO; }
  async run(input: CreateQuoteDocumentCommandInput, context: CommandContext): Promise<CommandResult<CreateQuoteDocumentCommandDTO>> { return runGovernedCommand(this, input, context); }
}
