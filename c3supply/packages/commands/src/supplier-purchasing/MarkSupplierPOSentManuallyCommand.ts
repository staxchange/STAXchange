import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface MarkSupplierPOSentManuallyCommandInput { supplierPoId: string; sentBy: string; }
export interface MarkSupplierPOSentManuallyCommandDTO { id: string; workflow: "supplier-purchasing"; status: "SUPPLIER_PO_SENT_MANUALLY"; command: "MarkSupplierPOSentManuallyCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class MarkSupplierPOSentManuallyCommand implements GovernedCommand<MarkSupplierPOSentManuallyCommandInput, MarkSupplierPOSentManuallyCommandDTO> {
  validateInput(input: MarkSupplierPOSentManuallyCommandInput): void {
    if (!input.supplierPoId) throw new Error("supplierPoId is required.");
    if (!input.sentBy) throw new Error("sentBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: MarkSupplierPOSentManuallyCommandInput): GovernanceResult { void input; return requirePermission(actor, "supplier_po.sent_manual.mark"); }
  async executeMutation(input: MarkSupplierPOSentManuallyCommandInput, context: CommandContext): Promise<MarkSupplierPOSentManuallyCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "supplier-purchasing", status: "SUPPLIER_PO_SENT_MANUALLY", command: "MarkSupplierPOSentManuallyCommand" }; }
  async appendAuditEvent(actor: Actor, input: MarkSupplierPOSentManuallyCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as MarkSupplierPOSentManuallyCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "MarkSupplierPOSentManuallyCommand", workflow: "supplier-purchasing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): MarkSupplierPOSentManuallyCommandDTO { return mutationResult as MarkSupplierPOSentManuallyCommandDTO; }
  async run(input: MarkSupplierPOSentManuallyCommandInput, context: CommandContext): Promise<CommandResult<MarkSupplierPOSentManuallyCommandDTO>> { return runGovernedCommand(this, input, context); }
}
