import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RejectCommerceInvoiceCommandInput { invoiceId: string; rejectedBy: string; reason: string; }
export interface RejectCommerceInvoiceCommandDTO { id: string; workflow: "commerce-billing"; status: "INVOICE_REJECTED"; command: "RejectCommerceInvoiceCommand"; }
export class RejectCommerceInvoiceCommand implements GovernedCommand<RejectCommerceInvoiceCommandInput, RejectCommerceInvoiceCommandDTO> {
  validateInput(input: RejectCommerceInvoiceCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).rejectedBy) throw new Error("rejectedBy is required.");
    if (!(input as any).reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RejectCommerceInvoiceCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_invoice.reject"); }
  async executeMutation(input: RejectCommerceInvoiceCommandInput, context: CommandContext): Promise<RejectCommerceInvoiceCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "INVOICE_REJECTED", command: "RejectCommerceInvoiceCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RejectCommerceInvoiceCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RejectCommerceInvoiceCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RejectCommerceInvoiceCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RejectCommerceInvoiceCommandDTO { return mutationResult as RejectCommerceInvoiceCommandDTO; }
  async run(input: RejectCommerceInvoiceCommandInput, context: CommandContext): Promise<CommandResult<RejectCommerceInvoiceCommandDTO>> { return runGovernedCommand(this, input, context); }
}
