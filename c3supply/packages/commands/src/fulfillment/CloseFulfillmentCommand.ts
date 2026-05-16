import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CloseFulfillmentCommandInput { fulfillmentId: string; closedBy: string; reason: string; }
export interface CloseFulfillmentCommandDTO { id: string; workflow: "fulfillment"; status: "FULFILLMENT_CLOSED"; command: "CloseFulfillmentCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class CloseFulfillmentCommand implements GovernedCommand<CloseFulfillmentCommandInput, CloseFulfillmentCommandDTO> {
  validateInput(input: CloseFulfillmentCommandInput): void {
    if (!input.fulfillmentId) throw new Error("fulfillmentId is required.");
    if (!input.closedBy) throw new Error("closedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CloseFulfillmentCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.close"); }
  async executeMutation(input: CloseFulfillmentCommandInput, context: CommandContext): Promise<CloseFulfillmentCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "FULFILLMENT_CLOSED", command: "CloseFulfillmentCommand" }; }
  async appendAuditEvent(actor: Actor, input: CloseFulfillmentCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CloseFulfillmentCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CloseFulfillmentCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CloseFulfillmentCommandDTO { return mutationResult as CloseFulfillmentCommandDTO; }
  async run(input: CloseFulfillmentCommandInput, context: CommandContext): Promise<CommandResult<CloseFulfillmentCommandDTO>> { return runGovernedCommand(this, input, context); }
}
