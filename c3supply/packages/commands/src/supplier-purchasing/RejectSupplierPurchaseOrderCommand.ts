import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RejectSupplierPurchaseOrderCommandInput { supplierPoId: string; rejectedBy: string; reason: string; }
export interface RejectSupplierPurchaseOrderCommandDTO { id: string; workflow: "supplier-purchasing"; status: "SUPPLIER_PO_REJECTED"; command: "RejectSupplierPurchaseOrderCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class RejectSupplierPurchaseOrderCommand implements GovernedCommand<RejectSupplierPurchaseOrderCommandInput, RejectSupplierPurchaseOrderCommandDTO> {
  validateInput(input: RejectSupplierPurchaseOrderCommandInput): void {
    if (!input.supplierPoId) throw new Error("supplierPoId is required.");
    if (!input.rejectedBy) throw new Error("rejectedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RejectSupplierPurchaseOrderCommandInput): GovernanceResult { void input; return requirePermission(actor, "supplier_po.reject"); }
  async executeMutation(input: RejectSupplierPurchaseOrderCommandInput, context: CommandContext): Promise<RejectSupplierPurchaseOrderCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "supplier-purchasing", status: "SUPPLIER_PO_REJECTED", command: "RejectSupplierPurchaseOrderCommand" }; }
  async appendAuditEvent(actor: Actor, input: RejectSupplierPurchaseOrderCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RejectSupplierPurchaseOrderCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RejectSupplierPurchaseOrderCommand", workflow: "supplier-purchasing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RejectSupplierPurchaseOrderCommandDTO { return mutationResult as RejectSupplierPurchaseOrderCommandDTO; }
  async run(input: RejectSupplierPurchaseOrderCommandInput, context: CommandContext): Promise<CommandResult<RejectSupplierPurchaseOrderCommandDTO>> { return runGovernedCommand(this, input, context); }
}
