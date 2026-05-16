import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AttachProductToQuoteCommandInput { quoteId: string; productId: string; description: string; quantity: number; }
export interface AttachProductToQuoteCommandDTO { id: string; workflow: "commerce-quote"; status: "QUOTE_DRAFTED"; command: "AttachProductToQuoteCommand"; }

export class AttachProductToQuoteCommand implements GovernedCommand<AttachProductToQuoteCommandInput, AttachProductToQuoteCommandDTO> {
  validateInput(input: AttachProductToQuoteCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.productId) throw new Error("productId is required.");
    if (!input.description) throw new Error("description is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: AttachProductToQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.quote.attach_product"); }
  async executeMutation(input: AttachProductToQuoteCommandInput, context: CommandContext): Promise<AttachProductToQuoteCommandDTO> { void context; return { id: input.quoteId, workflow: "commerce-quote", status: "QUOTE_DRAFTED", command: "AttachProductToQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: AttachProductToQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AttachProductToQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "AttachProductToQuoteCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): AttachProductToQuoteCommandDTO { return mutationResult as AttachProductToQuoteCommandDTO; }
  async run(input: AttachProductToQuoteCommandInput, context: CommandContext): Promise<CommandResult<AttachProductToQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
