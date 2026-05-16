import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateOrderFromAcceptedQuoteCommandInput { quoteId: string; orderId?: string; quoteStatus: "QUOTE_ACCEPTED"; }
export interface CreateOrderFromAcceptedQuoteCommandDTO { id: string; workflow: "commerce-quote"; status: "ORDER_CREATED"; command: "CreateOrderFromAcceptedQuoteCommand"; }

export class CreateOrderFromAcceptedQuoteCommand implements GovernedCommand<CreateOrderFromAcceptedQuoteCommandInput, CreateOrderFromAcceptedQuoteCommandDTO> {
  validateInput(input: CreateOrderFromAcceptedQuoteCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.quoteStatus) throw new Error("quoteStatus is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateOrderFromAcceptedQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce.order.create"); }
  async executeMutation(input: CreateOrderFromAcceptedQuoteCommandInput, context: CommandContext): Promise<CreateOrderFromAcceptedQuoteCommandDTO> { void context; return { id: crypto.randomUUID(), workflow: "commerce-quote", status: "ORDER_CREATED", command: "CreateOrderFromAcceptedQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateOrderFromAcceptedQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateOrderFromAcceptedQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateOrderFromAcceptedQuoteCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateOrderFromAcceptedQuoteCommandDTO { return mutationResult as CreateOrderFromAcceptedQuoteCommandDTO; }
  async run(input: CreateOrderFromAcceptedQuoteCommandInput, context: CommandContext): Promise<CommandResult<CreateOrderFromAcceptedQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
