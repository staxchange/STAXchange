import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ConvertCartToQuoteRequestCommandInput { cartId: string; customerName: string; customerEmail: string; }
export interface ConvertCartToQuoteRequestCommandDTO { id: string; workflow: "commerce-quote"; status: "QUOTE_REQUESTED"; command: "ConvertCartToQuoteRequestCommand"; }

export class ConvertCartToQuoteRequestCommand implements GovernedCommand<ConvertCartToQuoteRequestCommandInput, ConvertCartToQuoteRequestCommandDTO> {
  validateInput(input: ConvertCartToQuoteRequestCommandInput): void {
    if (!input.cartId) throw new Error("cartId is required.");
    if (!input.customerName) throw new Error("customerName is required.");
    if (!input.customerEmail) throw new Error("customerEmail is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ConvertCartToQuoteRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "cart.convert_quote"); }
  async executeMutation(input: ConvertCartToQuoteRequestCommandInput, context: CommandContext): Promise<ConvertCartToQuoteRequestCommandDTO> { void context; return { id: input.cartId, workflow: "commerce-quote", status: "QUOTE_REQUESTED", command: "ConvertCartToQuoteRequestCommand" }; }
  async appendAuditEvent(actor: Actor, input: ConvertCartToQuoteRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ConvertCartToQuoteRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ConvertCartToQuoteRequestCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ConvertCartToQuoteRequestCommandDTO { return mutationResult as ConvertCartToQuoteRequestCommandDTO; }
  async run(input: ConvertCartToQuoteRequestCommandInput, context: CommandContext): Promise<CommandResult<ConvertCartToQuoteRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
