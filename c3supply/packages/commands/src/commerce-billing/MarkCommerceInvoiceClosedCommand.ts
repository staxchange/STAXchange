import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface MarkCommerceInvoiceClosedCommandInput { invoiceId: string; closedBy: string; }
export interface MarkCommerceInvoiceClosedCommandDTO { id: string; workflow: "commerce-billing"; status: "INVOICE_CLOSED"; command: "MarkCommerceInvoiceClosedCommand"; }
export class MarkCommerceInvoiceClosedCommand implements GovernedCommand<MarkCommerceInvoiceClosedCommandInput, MarkCommerceInvoiceClosedCommandDTO> {
  validateInput(input: MarkCommerceInvoiceClosedCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).closedBy) throw new Error("closedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: MarkCommerceInvoiceClosedCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_invoice.close"); }
  async executeMutation(input: MarkCommerceInvoiceClosedCommandInput, context: CommandContext): Promise<MarkCommerceInvoiceClosedCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "INVOICE_CLOSED", command: "MarkCommerceInvoiceClosedCommand" };
  }
  async appendAuditEvent(actor: Actor, input: MarkCommerceInvoiceClosedCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as MarkCommerceInvoiceClosedCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "MarkCommerceInvoiceClosedCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): MarkCommerceInvoiceClosedCommandDTO { return mutationResult as MarkCommerceInvoiceClosedCommandDTO; }
  async run(input: MarkCommerceInvoiceClosedCommandInput, context: CommandContext): Promise<CommandResult<MarkCommerceInvoiceClosedCommandDTO>> { return runGovernedCommand(this, input, context); }
}
