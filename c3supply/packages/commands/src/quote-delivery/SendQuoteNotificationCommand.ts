import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface SendQuoteNotificationCommandInput { quoteDeliveryId: string; recipient: string; channel: "EMAIL" | "SECURE_LINK" | "MANUAL_SEND" | "CUSTOMER_PORTAL"; }

export interface SendQuoteNotificationCommandDTO { id: string; workflow: "quote-delivery"; status: "CUSTOMER_NOTIFIED"; command: "SendQuoteNotificationCommand"; }

export class SendQuoteNotificationCommand implements GovernedCommand<SendQuoteNotificationCommandInput, SendQuoteNotificationCommandDTO> {
  validateInput(input: SendQuoteNotificationCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (!input.recipient) throw new Error("recipient is required.");
    if (!input.channel) throw new Error("channel is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: SendQuoteNotificationCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.notification.send"); }
  async executeMutation(input: SendQuoteNotificationCommandInput, context: CommandContext): Promise<SendQuoteNotificationCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "CUSTOMER_NOTIFIED", command: "SendQuoteNotificationCommand" };
  }
  async appendAuditEvent(actor: Actor, input: SendQuoteNotificationCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SendQuoteNotificationCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "SendQuoteNotificationCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): SendQuoteNotificationCommandDTO { return mutationResult as SendQuoteNotificationCommandDTO; }
  async run(input: SendQuoteNotificationCommandInput, context: CommandContext): Promise<CommandResult<SendQuoteNotificationCommandDTO>> { return runGovernedCommand(this, input, context); }
}
