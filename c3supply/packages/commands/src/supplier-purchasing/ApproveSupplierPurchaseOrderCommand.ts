import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApproveSupplierPurchaseOrderCommandInput { supplierPoId: string; approvedBy: string; }
export interface ApproveSupplierPurchaseOrderCommandDTO { id: string; workflow: "supplier-purchasing"; status: "SUPPLIER_PO_APPROVED"; command: "ApproveSupplierPurchaseOrderCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class ApproveSupplierPurchaseOrderCommand implements GovernedCommand<ApproveSupplierPurchaseOrderCommandInput, ApproveSupplierPurchaseOrderCommandDTO> {
  validateInput(input: ApproveSupplierPurchaseOrderCommandInput): void {
    if (!input.supplierPoId) throw new Error("supplierPoId is required.");
    if (!input.approvedBy) throw new Error("approvedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ApproveSupplierPurchaseOrderCommandInput): GovernanceResult { void input; return requirePermission(actor, "supplier_po.approve"); }
  async executeMutation(input: ApproveSupplierPurchaseOrderCommandInput, context: CommandContext): Promise<ApproveSupplierPurchaseOrderCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "supplier-purchasing", status: "SUPPLIER_PO_APPROVED", command: "ApproveSupplierPurchaseOrderCommand" }; }
  async appendAuditEvent(actor: Actor, input: ApproveSupplierPurchaseOrderCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ApproveSupplierPurchaseOrderCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ApproveSupplierPurchaseOrderCommand", workflow: "supplier-purchasing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ApproveSupplierPurchaseOrderCommandDTO { return mutationResult as ApproveSupplierPurchaseOrderCommandDTO; }
  async run(input: ApproveSupplierPurchaseOrderCommandInput, context: CommandContext): Promise<CommandResult<ApproveSupplierPurchaseOrderCommandDTO>> { return runGovernedCommand(this, input, context); }
}
