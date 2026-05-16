import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface MarkShipmentPendingCommandInput { fulfillmentRequestId: string; markedBy: string; }
export interface MarkShipmentPendingCommandDTO { id: string; workflow: "fulfillment"; status: "SHIPMENT_PENDING"; command: "MarkShipmentPendingCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class MarkShipmentPendingCommand implements GovernedCommand<MarkShipmentPendingCommandInput, MarkShipmentPendingCommandDTO> {
  validateInput(input: MarkShipmentPendingCommandInput): void {
    if (!input.fulfillmentRequestId) throw new Error("fulfillmentRequestId is required.");
    if (!input.markedBy) throw new Error("markedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: MarkShipmentPendingCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.shipment_pending.mark"); }
  async executeMutation(input: MarkShipmentPendingCommandInput, context: CommandContext): Promise<MarkShipmentPendingCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "SHIPMENT_PENDING", command: "MarkShipmentPendingCommand" }; }
  async appendAuditEvent(actor: Actor, input: MarkShipmentPendingCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as MarkShipmentPendingCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "MarkShipmentPendingCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): MarkShipmentPendingCommandDTO { return mutationResult as MarkShipmentPendingCommandDTO; }
  async run(input: MarkShipmentPendingCommandInput, context: CommandContext): Promise<CommandResult<MarkShipmentPendingCommandDTO>> { return runGovernedCommand(this, input, context); }
}
