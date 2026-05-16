import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AcceptCommerceQuoteCommandInput { quoteId: string; acceptedBy: string; }
export interface AcceptCommerceQuoteCommandDTO { id: string; workflow: "commerce-quote"; status: "QUOTE_ACCEPTED"; command: "AcceptCommerceQuoteCommand"; }

export class AcceptCommerceQuoteCommand implements GovernedCommand<AcceptCommerceQuoteCommandInput, AcceptCommerceQuoteCommandDTO> {
  validateInput(input: AcceptCommerceQuoteCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.acceptedBy) throw new Error("acceptedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: AcceptCommerceQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.quote.accept"); }
  async executeMutation(input: AcceptCommerceQuoteCommandInput, context: CommandContext): Promise<AcceptCommerceQuoteCommandDTO> { void context; return { id: input.quoteId, workflow: "commerce-quote", status: "QUOTE_ACCEPTED", command: "AcceptCommerceQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: AcceptCommerceQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AcceptCommerceQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "AcceptCommerceQuoteCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): AcceptCommerceQuoteCommandDTO { return mutationResult as AcceptCommerceQuoteCommandDTO; }
  async run(input: AcceptCommerceQuoteCommandInput, context: CommandContext): Promise<CommandResult<AcceptCommerceQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
