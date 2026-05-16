import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface MarkQuoteDeliveryFailedCommandInput { quoteDeliveryId: string; failureReason: string; }

export interface MarkQuoteDeliveryFailedCommandDTO { id: string; workflow: "quote-delivery"; status: "DELIVERY_FAILED"; command: "MarkQuoteDeliveryFailedCommand"; }

export class MarkQuoteDeliveryFailedCommand implements GovernedCommand<MarkQuoteDeliveryFailedCommandInput, MarkQuoteDeliveryFailedCommandDTO> {
  validateInput(input: MarkQuoteDeliveryFailedCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (!input.failureReason) throw new Error("failureReason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: MarkQuoteDeliveryFailedCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.fail"); }
  async executeMutation(input: MarkQuoteDeliveryFailedCommandInput, context: CommandContext): Promise<MarkQuoteDeliveryFailedCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "DELIVERY_FAILED", command: "MarkQuoteDeliveryFailedCommand" };
  }
  async appendAuditEvent(actor: Actor, input: MarkQuoteDeliveryFailedCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as MarkQuoteDeliveryFailedCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "MarkQuoteDeliveryFailedCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): MarkQuoteDeliveryFailedCommandDTO { return mutationResult as MarkQuoteDeliveryFailedCommandDTO; }
  async run(input: MarkQuoteDeliveryFailedCommandInput, context: CommandContext): Promise<CommandResult<MarkQuoteDeliveryFailedCommandDTO>> { return runGovernedCommand(this, input, context); }
}
