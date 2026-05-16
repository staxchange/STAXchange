import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordShipmentConfirmationCommandInput { fulfillmentRequestId: string; confirmedBy: string; shipmentCarrier?: string; trackingReference?: string; }
export interface RecordShipmentConfirmationCommandDTO { id: string; workflow: "fulfillment"; status: "SHIPMENT_CONFIRMED"; command: "RecordShipmentConfirmationCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class RecordShipmentConfirmationCommand implements GovernedCommand<RecordShipmentConfirmationCommandInput, RecordShipmentConfirmationCommandDTO> {
  validateInput(input: RecordShipmentConfirmationCommandInput): void {
    if (!input.fulfillmentRequestId) throw new Error("fulfillmentRequestId is required.");
    if (!input.confirmedBy) throw new Error("confirmedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordShipmentConfirmationCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.shipment_confirmation.record"); }
  async executeMutation(input: RecordShipmentConfirmationCommandInput, context: CommandContext): Promise<RecordShipmentConfirmationCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "SHIPMENT_CONFIRMED", command: "RecordShipmentConfirmationCommand" }; }
  async appendAuditEvent(actor: Actor, input: RecordShipmentConfirmationCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordShipmentConfirmationCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordShipmentConfirmationCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordShipmentConfirmationCommandDTO { return mutationResult as RecordShipmentConfirmationCommandDTO; }
  async run(input: RecordShipmentConfirmationCommandInput, context: CommandContext): Promise<CommandResult<RecordShipmentConfirmationCommandDTO>> { return runGovernedCommand(this, input, context); }
}
