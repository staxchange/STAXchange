import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SubmitCommerceInvoiceForFinanceReviewCommandInput { invoiceId: string; submittedBy: string; }
export interface SubmitCommerceInvoiceForFinanceReviewCommandDTO { id: string; workflow: "commerce-billing"; status: "FINANCE_REVIEW_REQUIRED"; command: "SubmitCommerceInvoiceForFinanceReviewCommand"; }
export class SubmitCommerceInvoiceForFinanceReviewCommand implements GovernedCommand<SubmitCommerceInvoiceForFinanceReviewCommandInput, SubmitCommerceInvoiceForFinanceReviewCommandDTO> {
  validateInput(input: SubmitCommerceInvoiceForFinanceReviewCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).submittedBy) throw new Error("submittedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: SubmitCommerceInvoiceForFinanceReviewCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_invoice.submit_finance_review"); }
  async executeMutation(input: SubmitCommerceInvoiceForFinanceReviewCommandInput, context: CommandContext): Promise<SubmitCommerceInvoiceForFinanceReviewCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "FINANCE_REVIEW_REQUIRED", command: "SubmitCommerceInvoiceForFinanceReviewCommand" };
  }
  async appendAuditEvent(actor: Actor, input: SubmitCommerceInvoiceForFinanceReviewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SubmitCommerceInvoiceForFinanceReviewCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "SubmitCommerceInvoiceForFinanceReviewCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): SubmitCommerceInvoiceForFinanceReviewCommandDTO { return mutationResult as SubmitCommerceInvoiceForFinanceReviewCommandDTO; }
  async run(input: SubmitCommerceInvoiceForFinanceReviewCommandInput, context: CommandContext): Promise<CommandResult<SubmitCommerceInvoiceForFinanceReviewCommandDTO>> { return runGovernedCommand(this, input, context); }
}
