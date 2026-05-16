import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SubmitSupplierPurchaseOrderForReviewCommandInput { supplierPoId: string; submittedBy: string; }
export interface SubmitSupplierPurchaseOrderForReviewCommandDTO { id: string; workflow: "supplier-purchasing"; status: "SUPPLIER_PO_REVIEW_REQUIRED"; command: "SubmitSupplierPurchaseOrderForReviewCommand"; }
function entityId(input: Record<string, unknown>): string {
  return String(input.fulfillmentId ?? input.fulfillmentPlanId ?? input.fulfillmentRequestId ?? input.supplierPoId ?? input.orderId ?? input.quoteId ?? input.paymentId ?? crypto.randomUUID());
}
export class SubmitSupplierPurchaseOrderForReviewCommand implements GovernedCommand<SubmitSupplierPurchaseOrderForReviewCommandInput, SubmitSupplierPurchaseOrderForReviewCommandDTO> {
  validateInput(input: SubmitSupplierPurchaseOrderForReviewCommandInput): void {
    if (!input.supplierPoId) throw new Error("supplierPoId is required.");
    if (!input.submittedBy) throw new Error("submittedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: SubmitSupplierPurchaseOrderForReviewCommandInput): GovernanceResult { void input; return requirePermission(actor, "supplier_po.submit_review"); }
  async executeMutation(input: SubmitSupplierPurchaseOrderForReviewCommandInput, context: CommandContext): Promise<SubmitSupplierPurchaseOrderForReviewCommandDTO> { void context; return { id: entityId(input as unknown as Record<string, unknown>), workflow: "supplier-purchasing", status: "SUPPLIER_PO_REVIEW_REQUIRED", command: "SubmitSupplierPurchaseOrderForReviewCommand" }; }
  async appendAuditEvent(actor: Actor, input: SubmitSupplierPurchaseOrderForReviewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SubmitSupplierPurchaseOrderForReviewCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "SubmitSupplierPurchaseOrderForReviewCommand", workflow: "supplier-purchasing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): SubmitSupplierPurchaseOrderForReviewCommandDTO { return mutationResult as SubmitSupplierPurchaseOrderForReviewCommandDTO; }
  async run(input: SubmitSupplierPurchaseOrderForReviewCommandInput, context: CommandContext): Promise<CommandResult<SubmitSupplierPurchaseOrderForReviewCommandDTO>> { return runGovernedCommand(this, input, context); }
}
