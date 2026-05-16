import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CloseQuoteDeliveryCommandInput { quoteDeliveryId: string; closedBy: string; }

export interface CloseQuoteDeliveryCommandDTO { id: string; workflow: "quote-delivery"; status: "DELIVERY_CLOSED"; command: "CloseQuoteDeliveryCommand"; }

export class CloseQuoteDeliveryCommand implements GovernedCommand<CloseQuoteDeliveryCommandInput, CloseQuoteDeliveryCommandDTO> {
  validateInput(input: CloseQuoteDeliveryCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (!input.closedBy) throw new Error("closedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CloseQuoteDeliveryCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.close"); }
  async executeMutation(input: CloseQuoteDeliveryCommandInput, context: CommandContext): Promise<CloseQuoteDeliveryCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "DELIVERY_CLOSED", command: "CloseQuoteDeliveryCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CloseQuoteDeliveryCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CloseQuoteDeliveryCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CloseQuoteDeliveryCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CloseQuoteDeliveryCommandDTO { return mutationResult as CloseQuoteDeliveryCommandDTO; }
  async run(input: CloseQuoteDeliveryCommandInput, context: CommandContext): Promise<CommandResult<CloseQuoteDeliveryCommandDTO>> { return runGovernedCommand(this, input, context); }
}
