import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface SubmitPaymentRequestForReviewCommandInput { paymentRequestId: string; submittedBy: string; }
export interface SubmitPaymentRequestForReviewCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_REVIEW_REQUIRED"; command: "SubmitPaymentRequestForReviewCommand"; }

export class SubmitPaymentRequestForReviewCommand implements GovernedCommand<SubmitPaymentRequestForReviewCommandInput, SubmitPaymentRequestForReviewCommandDTO> {
  validateInput(input: SubmitPaymentRequestForReviewCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
    if (!input.submittedBy) throw new Error("submittedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: SubmitPaymentRequestForReviewCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.request.submit_review"); }
  async executeMutation(input: SubmitPaymentRequestForReviewCommandInput, context: CommandContext): Promise<SubmitPaymentRequestForReviewCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_REVIEW_REQUIRED", command: "SubmitPaymentRequestForReviewCommand" };
  }
  async appendAuditEvent(actor: Actor, input: SubmitPaymentRequestForReviewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as SubmitPaymentRequestForReviewCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "SubmitPaymentRequestForReviewCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): SubmitPaymentRequestForReviewCommandDTO { return mutationResult as SubmitPaymentRequestForReviewCommandDTO; }
  async run(input: SubmitPaymentRequestForReviewCommandInput, context: CommandContext): Promise<CommandResult<SubmitPaymentRequestForReviewCommandDTO>> { return runGovernedCommand(this, input, context); }
}
