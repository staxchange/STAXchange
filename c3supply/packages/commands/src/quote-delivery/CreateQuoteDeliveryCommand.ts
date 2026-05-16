import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateQuoteDeliveryCommandInput { quoteId: string; quoteDocumentId: string; quotePricingSnapshotId: string; customerEmail?: string; channel: "EMAIL" | "SECURE_LINK" | "MANUAL_SEND" | "CUSTOMER_PORTAL"; pricingApproved: boolean; pricingLocked: boolean; documentApproved: boolean; }

export interface CreateQuoteDeliveryCommandDTO { id: string; workflow: "quote-delivery"; status: "DELIVERY_DRAFTED"; command: "CreateQuoteDeliveryCommand"; }

export class CreateQuoteDeliveryCommand implements GovernedCommand<CreateQuoteDeliveryCommandInput, CreateQuoteDeliveryCommandDTO> {
  validateInput(input: CreateQuoteDeliveryCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.quotePricingSnapshotId) throw new Error("quotePricingSnapshotId is required.");
    if (!input.channel) throw new Error("channel is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateQuoteDeliveryCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.create"); }
  async executeMutation(input: CreateQuoteDeliveryCommandInput, context: CommandContext): Promise<CreateQuoteDeliveryCommandDTO> {
    void context;
    return { id: crypto.randomUUID(), workflow: "quote-delivery", status: "DELIVERY_DRAFTED", command: "CreateQuoteDeliveryCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CreateQuoteDeliveryCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateQuoteDeliveryCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateQuoteDeliveryCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateQuoteDeliveryCommandDTO { return mutationResult as CreateQuoteDeliveryCommandDTO; }
  async run(input: CreateQuoteDeliveryCommandInput, context: CommandContext): Promise<CommandResult<CreateQuoteDeliveryCommandDTO>> { return runGovernedCommand(this, input, context); }
}
