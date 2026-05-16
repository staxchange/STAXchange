import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SendCommerceQuoteCommandInput { quoteId: string; sentBy: string; customerEmail: string; }
export interface SendCommerceQuoteCommandDTO { id: string; workflow: "commerce-quote"; status: "QUOTE_SENT"; command: "SendCommerceQuoteCommand"; }

export class SendCommerceQuoteCommand implements GovernedCommand<SendCommerceQuoteCommandInput, SendCommerceQuoteCommandDTO> {
  validateInput(input: SendCommerceQuoteCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.sentBy) throw new Error("sentBy is required.");
    if (!input.customerEmail) throw new Error("customerEmail is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: SendCommerceQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.quote.send"); }
  async executeMutation(input: SendCommerceQuoteCommandInput, context: CommandContext): Promise<SendCommerceQuoteCommandDTO> { void context; return { id: input.quoteId, workflow: "commerce-quote", status: "QUOTE_SENT", command: "SendCommerceQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: SendCommerceQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SendCommerceQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "SendCommerceQuoteCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): SendCommerceQuoteCommandDTO { return mutationResult as SendCommerceQuoteCommandDTO; }
  async run(input: SendCommerceQuoteCommandInput, context: CommandContext): Promise<CommandResult<SendCommerceQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
