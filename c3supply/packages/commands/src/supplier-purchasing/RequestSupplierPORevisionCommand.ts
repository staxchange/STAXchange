import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RequestSupplierPORevisionCommandInput { supplierPoId: string; requestedBy: string; reason: string; }
export interface RequestSupplierPORevisionCommandDTO { id: string; workflow: "supplier-purchasing"; status: "SUPPLIER_PO_REVISION_REQUIRED"; command: "RequestSupplierPORevisionCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class RequestSupplierPORevisionCommand implements GovernedCommand<RequestSupplierPORevisionCommandInput, RequestSupplierPORevisionCommandDTO> {
  validateInput(input: RequestSupplierPORevisionCommandInput): void {
    if (!input.supplierPoId) throw new Error("supplierPoId is required.");
    if (!input.requestedBy) throw new Error("requestedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RequestSupplierPORevisionCommandInput): GovernanceResult { void input; return requirePermission(actor, "supplier_po.revision.request"); }
  async executeMutation(input: RequestSupplierPORevisionCommandInput, context: CommandContext): Promise<RequestSupplierPORevisionCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "supplier-purchasing", status: "SUPPLIER_PO_REVISION_REQUIRED", command: "RequestSupplierPORevisionCommand" }; }
  async appendAuditEvent(actor: Actor, input: RequestSupplierPORevisionCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RequestSupplierPORevisionCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RequestSupplierPORevisionCommand", workflow: "supplier-purchasing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RequestSupplierPORevisionCommandDTO { return mutationResult as RequestSupplierPORevisionCommandDTO; }
  async run(input: RequestSupplierPORevisionCommandInput, context: CommandContext): Promise<CommandResult<RequestSupplierPORevisionCommandDTO>> { return runGovernedCommand(this, input, context); }
}
