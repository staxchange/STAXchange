import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreatePaymentRequestCommandInput { quoteId: string; customerEmail?: string; currency: "CAD" | "USD"; amountCents: number; depositRequired: boolean; depositAmountCents?: number; quoteAccepted: boolean; pricingApproved: boolean; pricingLocked: boolean; quoteDocumentApproved: boolean; }
export interface CreatePaymentRequestCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_REQUEST_DRAFTED"; command: "CreatePaymentRequestCommand"; }

export class CreatePaymentRequestCommand implements GovernedCommand<CreatePaymentRequestCommandInput, CreatePaymentRequestCommandDTO> {
  validateInput(input: CreatePaymentRequestCommandInput): void {
    if (!input.quoteId) throw new Error("quoteId is required.");
    if (!input.currency) throw new Error("currency is required.");
    if (input.amountCents === undefined || input.amountCents <= 0) throw new Error("amountCents must be positive.");
    if (!input.quoteAccepted) throw new Error("accepted quote required");
    if (!input.pricingApproved || !input.pricingLocked) throw new Error("approved and locked pricing required");
    if (!input.quoteDocumentApproved) throw new Error("approved quote document required");
    if (input.depositRequired && (!input.depositAmountCents || input.depositAmountCents <= 0)) throw new Error("explicit deposit amount required");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreatePaymentRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.request.create"); }
  async executeMutation(input: CreatePaymentRequestCommandInput, context: CommandContext): Promise<CreatePaymentRequestCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_REQUEST_DRAFTED", command: "CreatePaymentRequestCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CreatePaymentRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreatePaymentRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreatePaymentRequestCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreatePaymentRequestCommandDTO { return mutationResult as CreatePaymentRequestCommandDTO; }
  async run(input: CreatePaymentRequestCommandInput, context: CommandContext): Promise<CommandResult<CreatePaymentRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
