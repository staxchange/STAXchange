import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateCommerceQuoteRequestCommandInput { quoteRequestId?: string; customerName: string; customerEmail: string; cartId?: string; }
export interface CreateCommerceQuoteRequestCommandDTO { id: string; workflow: "commerce-quote"; status: "QUOTE_REQUESTED"; command: "CreateCommerceQuoteRequestCommand"; }

export class CreateCommerceQuoteRequestCommand implements GovernedCommand<CreateCommerceQuoteRequestCommandInput, CreateCommerceQuoteRequestCommandDTO> {
  validateInput(input: CreateCommerceQuoteRequestCommandInput): void {
    if (!input.customerName) throw new Error("customerName is required.");
    if (!input.customerEmail) throw new Error("customerEmail is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateCommerceQuoteRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.quote.create"); }
  async executeMutation(input: CreateCommerceQuoteRequestCommandInput, context: CommandContext): Promise<CreateCommerceQuoteRequestCommandDTO> { void context; return { id: crypto.randomUUID(), workflow: "commerce-quote", status: "QUOTE_REQUESTED", command: "CreateCommerceQuoteRequestCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateCommerceQuoteRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateCommerceQuoteRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateCommerceQuoteRequestCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateCommerceQuoteRequestCommandDTO { return mutationResult as CreateCommerceQuoteRequestCommandDTO; }
  async run(input: CreateCommerceQuoteRequestCommandInput, context: CommandContext): Promise<CommandResult<CreateCommerceQuoteRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
