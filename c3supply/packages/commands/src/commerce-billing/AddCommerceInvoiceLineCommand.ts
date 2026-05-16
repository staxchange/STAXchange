import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AddCommerceInvoiceLineCommandInput { invoiceId: string; description: string; quantity: number; unitPriceCents: number; }
export interface AddCommerceInvoiceLineCommandDTO { id: string; workflow: "commerce-billing"; status: "INVOICE_DRAFT_CREATED"; command: "AddCommerceInvoiceLineCommand"; }
export class AddCommerceInvoiceLineCommand implements GovernedCommand<AddCommerceInvoiceLineCommandInput, AddCommerceInvoiceLineCommandDTO> {
  validateInput(input: AddCommerceInvoiceLineCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).description) throw new Error("description is required.");
    if ((input as any).quantity === undefined || (input as any).quantity < 0) throw new Error("quantity is required.");
    if ((input as any).unitPriceCents === undefined || (input as any).unitPriceCents < 0) throw new Error("unitPriceCents is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: AddCommerceInvoiceLineCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_invoice.line.add"); }
  async executeMutation(input: AddCommerceInvoiceLineCommandInput, context: CommandContext): Promise<AddCommerceInvoiceLineCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "INVOICE_DRAFT_CREATED", command: "AddCommerceInvoiceLineCommand" };
  }
  async appendAuditEvent(actor: Actor, input: AddCommerceInvoiceLineCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AddCommerceInvoiceLineCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "AddCommerceInvoiceLineCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): AddCommerceInvoiceLineCommandDTO { return mutationResult as AddCommerceInvoiceLineCommandDTO; }
  async run(input: AddCommerceInvoiceLineCommandInput, context: CommandContext): Promise<CommandResult<AddCommerceInvoiceLineCommandDTO>> { return runGovernedCommand(this, input, context); }
}
