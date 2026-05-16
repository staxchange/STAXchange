import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateQuoteShareLinkCommandInput { quoteDocumentId: string; documentApproved: boolean; expiresAt: string; createdBy: string; }
export interface CreateQuoteShareLinkCommandDTO { id: string; workflow: "quote-document"; status: "SHARE_LINK_CREATED"; command: "CreateQuoteShareLinkCommand"; }

export class CreateQuoteShareLinkCommand implements GovernedCommand<CreateQuoteShareLinkCommandInput, CreateQuoteShareLinkCommandDTO> {
  validateInput(input: CreateQuoteShareLinkCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.expiresAt) throw new Error("expiresAt is required.");
    if (!input.createdBy) throw new Error("createdBy is required.");
    if (!input.documentApproved) throw new Error("documentApproved is required before share link creation.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateQuoteShareLinkCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.share_link.create"); }
  async executeMutation(input: CreateQuoteShareLinkCommandInput, context: CommandContext): Promise<CreateQuoteShareLinkCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "SHARE_LINK_CREATED", command: "CreateQuoteShareLinkCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateQuoteShareLinkCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateQuoteShareLinkCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateQuoteShareLinkCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateQuoteShareLinkCommandDTO { return mutationResult as CreateQuoteShareLinkCommandDTO; }
  async run(input: CreateQuoteShareLinkCommandInput, context: CommandContext): Promise<CommandResult<CreateQuoteShareLinkCommandDTO>> { return runGovernedCommand(this, input, context); }
}
