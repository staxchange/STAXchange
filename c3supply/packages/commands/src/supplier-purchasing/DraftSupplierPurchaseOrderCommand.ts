import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface DraftSupplierPurchaseOrderCommandInput { fulfillmentPlanId: string; supplierName: string; draftedBy: string; }
export interface DraftSupplierPurchaseOrderCommandDTO { id: string; workflow: "supplier-purchasing"; status: "SUPPLIER_PO_DRAFTED"; command: "DraftSupplierPurchaseOrderCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class DraftSupplierPurchaseOrderCommand implements GovernedCommand<DraftSupplierPurchaseOrderCommandInput, DraftSupplierPurchaseOrderCommandDTO> {
  validateInput(input: DraftSupplierPurchaseOrderCommandInput): void {
    if (!input.fulfillmentPlanId) throw new Error("fulfillmentPlanId is required.");
    if (!input.supplierName) throw new Error("supplierName is required.");
    if (!input.draftedBy) throw new Error("draftedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: DraftSupplierPurchaseOrderCommandInput): GovernanceResult { void input; return requirePermission(actor, "supplier_po.draft"); }
  async executeMutation(input: DraftSupplierPurchaseOrderCommandInput, context: CommandContext): Promise<DraftSupplierPurchaseOrderCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "supplier-purchasing", status: "SUPPLIER_PO_DRAFTED", command: "DraftSupplierPurchaseOrderCommand" }; }
  async appendAuditEvent(actor: Actor, input: DraftSupplierPurchaseOrderCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as DraftSupplierPurchaseOrderCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "DraftSupplierPurchaseOrderCommand", workflow: "supplier-purchasing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): DraftSupplierPurchaseOrderCommandDTO { return mutationResult as DraftSupplierPurchaseOrderCommandDTO; }
  async run(input: DraftSupplierPurchaseOrderCommandInput, context: CommandContext): Promise<CommandResult<DraftSupplierPurchaseOrderCommandDTO>> { return runGovernedCommand(this, input, context); }
}
