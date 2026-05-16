import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApproveCommerceInvoiceCommandInput { invoiceId: string; approvedBy: string; }
export interface ApproveCommerceInvoiceCommandDTO { id: string; workflow: "commerce-billing"; status: "INVOICE_APPROVED"; command: "ApproveCommerceInvoiceCommand"; }
export class ApproveCommerceInvoiceCommand implements GovernedCommand<ApproveCommerceInvoiceCommandInput, ApproveCommerceInvoiceCommandDTO> {
  validateInput(input: ApproveCommerceInvoiceCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).approvedBy) throw new Error("approvedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ApproveCommerceInvoiceCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_invoice.approve"); }
  async executeMutation(input: ApproveCommerceInvoiceCommandInput, context: CommandContext): Promise<ApproveCommerceInvoiceCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "INVOICE_APPROVED", command: "ApproveCommerceInvoiceCommand" };
  }
  async appendAuditEvent(actor: Actor, input: ApproveCommerceInvoiceCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ApproveCommerceInvoiceCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ApproveCommerceInvoiceCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ApproveCommerceInvoiceCommandDTO { return mutationResult as ApproveCommerceInvoiceCommandDTO; }
  async run(input: ApproveCommerceInvoiceCommandInput, context: CommandContext): Promise<CommandResult<ApproveCommerceInvoiceCommandDTO>> { return runGovernedCommand(this, input, context); }
}
