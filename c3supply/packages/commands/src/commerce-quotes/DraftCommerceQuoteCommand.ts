import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface DraftCommerceQuoteCommandInput { quoteId: string; draftedBy: string; }
export interface DraftCommerceQuoteCommandDTO { id: string; workflow: "commerce-quote"; status: "QUOTE_DRAFTED"; command: "DraftCommerceQuoteCommand"; }

export class DraftCommerceQuoteCommand implements GovernedCommand<DraftCommerceQuoteCommandInput, DraftCommerceQuoteCommandDTO> {
  validateInput(input: DraftCommerceQuoteCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.draftedBy) throw new Error("draftedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: DraftCommerceQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.quote.draft"); }
  async executeMutation(input: DraftCommerceQuoteCommandInput, context: CommandContext): Promise<DraftCommerceQuoteCommandDTO> { void context; return { id: input.quoteId, workflow: "commerce-quote", status: "QUOTE_DRAFTED", command: "DraftCommerceQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: DraftCommerceQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as DraftCommerceQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "DraftCommerceQuoteCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): DraftCommerceQuoteCommandDTO { return mutationResult as DraftCommerceQuoteCommandDTO; }
  async run(input: DraftCommerceQuoteCommandInput, context: CommandContext): Promise<CommandResult<DraftCommerceQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
