import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RejectPaymentRequestCommandInput { paymentRequestId: string; rejectedBy: string; reason: string; }
export interface RejectPaymentRequestCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_FAILED"; command: "RejectPaymentRequestCommand"; }

export class RejectPaymentRequestCommand implements GovernedCommand<RejectPaymentRequestCommandInput, RejectPaymentRequestCommandDTO> {
  validateInput(input: RejectPaymentRequestCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
    if (!input.rejectedBy) throw new Error("rejectedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RejectPaymentRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.request.reject"); }
  async executeMutation(input: RejectPaymentRequestCommandInput, context: CommandContext): Promise<RejectPaymentRequestCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_FAILED", command: "RejectPaymentRequestCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RejectPaymentRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RejectPaymentRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RejectPaymentRequestCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RejectPaymentRequestCommandDTO { return mutationResult as RejectPaymentRequestCommandDTO; }
  async run(input: RejectPaymentRequestCommandInput, context: CommandContext): Promise<CommandResult<RejectPaymentRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
