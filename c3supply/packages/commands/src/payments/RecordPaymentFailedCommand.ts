import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordPaymentFailedCommandInput { paymentRequestId: string; failureReason: string; stripeEventId?: string; }
export interface RecordPaymentFailedCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_FAILED"; command: "RecordPaymentFailedCommand"; }

export class RecordPaymentFailedCommand implements GovernedCommand<RecordPaymentFailedCommandInput, RecordPaymentFailedCommandDTO> {
  validateInput(input: RecordPaymentFailedCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
    if (!input.failureReason) throw new Error("failureReason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordPaymentFailedCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.failed.record"); }
  async executeMutation(input: RecordPaymentFailedCommandInput, context: CommandContext): Promise<RecordPaymentFailedCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_FAILED", command: "RecordPaymentFailedCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordPaymentFailedCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordPaymentFailedCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordPaymentFailedCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordPaymentFailedCommandDTO { return mutationResult as RecordPaymentFailedCommandDTO; }
  async run(input: RecordPaymentFailedCommandInput, context: CommandContext): Promise<CommandResult<RecordPaymentFailedCommandDTO>> { return runGovernedCommand(this, input, context); }
}
