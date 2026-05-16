import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateCommerceInvoiceDraftCommandInput { quoteId: string; orderId: string; paymentId: string; fulfillmentId: string; customerId: string; currency: "CAD" | "USD"; invoiceSubtotalCents: number; }
export interface CreateCommerceInvoiceDraftCommandDTO { id: string; workflow: "commerce-billing"; status: "INVOICE_DRAFT_CREATED"; command: "CreateCommerceInvoiceDraftCommand"; }
export class CreateCommerceInvoiceDraftCommand implements GovernedCommand<CreateCommerceInvoiceDraftCommandInput, CreateCommerceInvoiceDraftCommandDTO> {
  validateInput(input: CreateCommerceInvoiceDraftCommandInput): void {
    if (!(input as any).quoteId) throw new Error("quoteId is required.");
    if (!(input as any).orderId) throw new Error("orderId is required.");
    if (!(input as any).paymentId) throw new Error("paymentId is required.");
    if (!(input as any).fulfillmentId) throw new Error("fulfillmentId is required.");
    if (!(input as any).customerId) throw new Error("customerId is required.");
    if (!(input as any).currency) throw new Error("currency is required.");
    if ((input as any).invoiceSubtotalCents === undefined || (input as any).invoiceSubtotalCents < 0) throw new Error("invoiceSubtotalCents is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateCommerceInvoiceDraftCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_invoice.draft.create"); }
  async executeMutation(input: CreateCommerceInvoiceDraftCommandInput, context: CommandContext): Promise<CreateCommerceInvoiceDraftCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "INVOICE_DRAFT_CREATED", command: "CreateCommerceInvoiceDraftCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CreateCommerceInvoiceDraftCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateCommerceInvoiceDraftCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateCommerceInvoiceDraftCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateCommerceInvoiceDraftCommandDTO { return mutationResult as CreateCommerceInvoiceDraftCommandDTO; }
  async run(input: CreateCommerceInvoiceDraftCommandInput, context: CommandContext): Promise<CommandResult<CreateCommerceInvoiceDraftCommandDTO>> { return runGovernedCommand(this, input, context); }
}
