import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface NotifyCustomerFulfillmentCommandInput { fulfillmentRequestId: string; customerId: string; notifiedBy: string; }
export interface NotifyCustomerFulfillmentCommandDTO { id: string; workflow: "fulfillment"; status: "CUSTOMER_NOTIFIED"; command: "NotifyCustomerFulfillmentCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class NotifyCustomerFulfillmentCommand implements GovernedCommand<NotifyCustomerFulfillmentCommandInput, NotifyCustomerFulfillmentCommandDTO> {
  validateInput(input: NotifyCustomerFulfillmentCommandInput): void {
    if (!input.fulfillmentRequestId) throw new Error("fulfillmentRequestId is required.");
    if (!input.customerId) throw new Error("customerId is required.");
    if (!input.notifiedBy) throw new Error("notifiedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: NotifyCustomerFulfillmentCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.customer.notify"); }
  async executeMutation(input: NotifyCustomerFulfillmentCommandInput, context: CommandContext): Promise<NotifyCustomerFulfillmentCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "CUSTOMER_NOTIFIED", command: "NotifyCustomerFulfillmentCommand" }; }
  async appendAuditEvent(actor: Actor, input: NotifyCustomerFulfillmentCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as NotifyCustomerFulfillmentCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "NotifyCustomerFulfillmentCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): NotifyCustomerFulfillmentCommandDTO { return mutationResult as NotifyCustomerFulfillmentCommandDTO; }
  async run(input: NotifyCustomerFulfillmentCommandInput, context: CommandContext): Promise<CommandResult<NotifyCustomerFulfillmentCommandDTO>> { return runGovernedCommand(this, input, context); }
}
