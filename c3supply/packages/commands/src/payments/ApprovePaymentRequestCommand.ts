import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ApprovePaymentRequestCommandInput { paymentRequestId: string; approvedBy: string; }
export interface ApprovePaymentRequestCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_REQUEST_APPROVED"; command: "ApprovePaymentRequestCommand"; }

export class ApprovePaymentRequestCommand implements GovernedCommand<ApprovePaymentRequestCommandInput, ApprovePaymentRequestCommandDTO> {
  validateInput(input: ApprovePaymentRequestCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
    if (!input.approvedBy) throw new Error("approvedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ApprovePaymentRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.request.approve"); }
  async executeMutation(input: ApprovePaymentRequestCommandInput, context: CommandContext): Promise<ApprovePaymentRequestCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_REQUEST_APPROVED", command: "ApprovePaymentRequestCommand" };
  }
  async appendAuditEvent(actor: Actor, input: ApprovePaymentRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ApprovePaymentRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ApprovePaymentRequestCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ApprovePaymentRequestCommandDTO { return mutationResult as ApprovePaymentRequestCommandDTO; }
  async run(input: ApprovePaymentRequestCommandInput, context: CommandContext): Promise<CommandResult<ApprovePaymentRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
