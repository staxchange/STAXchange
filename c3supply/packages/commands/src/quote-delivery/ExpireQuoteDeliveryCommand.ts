import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface ExpireQuoteDeliveryCommandInput { quoteDeliveryId: string; reason: string; }

export interface ExpireQuoteDeliveryCommandDTO { id: string; workflow: "quote-delivery"; status: "DELIVERY_EXPIRED"; command: "ExpireQuoteDeliveryCommand"; }

export class ExpireQuoteDeliveryCommand implements GovernedCommand<ExpireQuoteDeliveryCommandInput, ExpireQuoteDeliveryCommandDTO> {
  validateInput(input: ExpireQuoteDeliveryCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ExpireQuoteDeliveryCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.expire"); }
  async executeMutation(input: ExpireQuoteDeliveryCommandInput, context: CommandContext): Promise<ExpireQuoteDeliveryCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "DELIVERY_EXPIRED", command: "ExpireQuoteDeliveryCommand" };
  }
  async appendAuditEvent(actor: Actor, input: ExpireQuoteDeliveryCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ExpireQuoteDeliveryCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ExpireQuoteDeliveryCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ExpireQuoteDeliveryCommandDTO { return mutationResult as ExpireQuoteDeliveryCommandDTO; }
  async run(input: ExpireQuoteDeliveryCommandInput, context: CommandContext): Promise<CommandResult<ExpireQuoteDeliveryCommandDTO>> { return runGovernedCommand(this, input, context); }
}
