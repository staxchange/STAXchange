import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordPaymentPendingCommandInput { paymentRequestId: string; stripeEventId?: string; }
export interface RecordPaymentPendingCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_PENDING"; command: "RecordPaymentPendingCommand"; }

export class RecordPaymentPendingCommand implements GovernedCommand<RecordPaymentPendingCommandInput, RecordPaymentPendingCommandDTO> {
  validateInput(input: RecordPaymentPendingCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordPaymentPendingCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.pending.record"); }
  async executeMutation(input: RecordPaymentPendingCommandInput, context: CommandContext): Promise<RecordPaymentPendingCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_PENDING", command: "RecordPaymentPendingCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordPaymentPendingCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordPaymentPendingCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordPaymentPendingCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordPaymentPendingCommandDTO { return mutationResult as RecordPaymentPendingCommandDTO; }
  async run(input: RecordPaymentPendingCommandInput, context: CommandContext): Promise<CommandResult<RecordPaymentPendingCommandDTO>> { return runGovernedCommand(this, input, context); }
}
