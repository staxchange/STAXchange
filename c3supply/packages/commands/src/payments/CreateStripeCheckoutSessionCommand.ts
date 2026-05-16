import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateStripeCheckoutSessionCommandInput { paymentRequestId: string; amountCents: number; currency: "CAD" | "USD"; paymentRequestApproved: boolean; }
export interface CreateStripeCheckoutSessionCommandDTO { id: string; workflow: "payments"; status: "CHECKOUT_SESSION_CREATED"; command: "CreateStripeCheckoutSessionCommand"; }

export class CreateStripeCheckoutSessionCommand implements GovernedCommand<CreateStripeCheckoutSessionCommandInput, CreateStripeCheckoutSessionCommandDTO> {
  validateInput(input: CreateStripeCheckoutSessionCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
    if (input.amountCents === undefined || input.amountCents <= 0) throw new Error("amountCents must be positive.");
    if (!input.currency) throw new Error("currency is required.");
    if (!input.paymentRequestApproved) throw new Error("approved payment request required before checkout");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateStripeCheckoutSessionCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.checkout.create"); }
  async executeMutation(input: CreateStripeCheckoutSessionCommandInput, context: CommandContext): Promise<CreateStripeCheckoutSessionCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "CHECKOUT_SESSION_CREATED", command: "CreateStripeCheckoutSessionCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CreateStripeCheckoutSessionCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateStripeCheckoutSessionCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateStripeCheckoutSessionCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateStripeCheckoutSessionCommandDTO { return mutationResult as CreateStripeCheckoutSessionCommandDTO; }
  async run(input: CreateStripeCheckoutSessionCommandInput, context: CommandContext): Promise<CommandResult<CreateStripeCheckoutSessionCommandDTO>> { return runGovernedCommand(this, input, context); }
}
