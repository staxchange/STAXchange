import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RequestRefundReviewCommandInput { paymentRequestId: string; requestedBy: string; reason: string; }
export interface RequestRefundReviewCommandDTO { id: string; workflow: "payments"; status: "REFUND_REVIEW_REQUESTED"; command: "RequestRefundReviewCommand"; }

export class RequestRefundReviewCommand implements GovernedCommand<RequestRefundReviewCommandInput, RequestRefundReviewCommandDTO> {
  validateInput(input: RequestRefundReviewCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
    if (!input.requestedBy) throw new Error("requestedBy is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RequestRefundReviewCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.refund_review.request"); }
  async executeMutation(input: RequestRefundReviewCommandInput, context: CommandContext): Promise<RequestRefundReviewCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "REFUND_REVIEW_REQUESTED", command: "RequestRefundReviewCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RequestRefundReviewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RequestRefundReviewCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RequestRefundReviewCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RequestRefundReviewCommandDTO { return mutationResult as RequestRefundReviewCommandDTO; }
  async run(input: RequestRefundReviewCommandInput, context: CommandContext): Promise<CommandResult<RequestRefundReviewCommandDTO>> { return runGovernedCommand(this, input, context); }
}
