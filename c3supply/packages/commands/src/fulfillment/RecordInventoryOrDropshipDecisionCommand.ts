import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordInventoryOrDropshipDecisionCommandInput { fulfillmentPlanId: string; route: "INVENTORY" | "DROPSHIP" | "SERVICE_WORK_ORDER" | "MANUAL_REVIEW"; decidedBy: string; note: string; }
export interface RecordInventoryOrDropshipDecisionCommandDTO { id: string; workflow: "fulfillment"; status: "INVENTORY_OR_DROPSHIP_DECISION_REQUIRED"; command: "RecordInventoryOrDropshipDecisionCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class RecordInventoryOrDropshipDecisionCommand implements GovernedCommand<RecordInventoryOrDropshipDecisionCommandInput, RecordInventoryOrDropshipDecisionCommandDTO> {
  validateInput(input: RecordInventoryOrDropshipDecisionCommandInput): void {
    if (!input.fulfillmentPlanId) throw new Error("fulfillmentPlanId is required.");
    if (!input.route) throw new Error("route is required.");
    if (!input.decidedBy) throw new Error("decidedBy is required.");
    if (!input.note) throw new Error("note is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordInventoryOrDropshipDecisionCommandInput): GovernanceResult { void input; return requirePermission(actor, "fulfillment.decision.record"); }
  async executeMutation(input: RecordInventoryOrDropshipDecisionCommandInput, context: CommandContext): Promise<RecordInventoryOrDropshipDecisionCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "fulfillment", status: "INVENTORY_OR_DROPSHIP_DECISION_REQUIRED", command: "RecordInventoryOrDropshipDecisionCommand" }; }
  async appendAuditEvent(actor: Actor, input: RecordInventoryOrDropshipDecisionCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordInventoryOrDropshipDecisionCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordInventoryOrDropshipDecisionCommand", workflow: "fulfillment", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordInventoryOrDropshipDecisionCommandDTO { return mutationResult as RecordInventoryOrDropshipDecisionCommandDTO; }
  async run(input: RecordInventoryOrDropshipDecisionCommandInput, context: CommandContext): Promise<CommandResult<RecordInventoryOrDropshipDecisionCommandDTO>> { return runGovernedCommand(this, input, context); }
}
