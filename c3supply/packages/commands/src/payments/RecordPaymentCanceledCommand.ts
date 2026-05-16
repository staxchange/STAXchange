import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordPaymentCanceledCommandInput { paymentRequestId: string; reason?: string; stripeEventId?: string; }
export interface RecordPaymentCanceledCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_CANCELED"; command: "RecordPaymentCanceledCommand"; }

export class RecordPaymentCanceledCommand implements GovernedCommand<RecordPaymentCanceledCommandInput, RecordPaymentCanceledCommandDTO> {
  validateInput(input: RecordPaymentCanceledCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordPaymentCanceledCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.canceled.record"); }
  async executeMutation(input: RecordPaymentCanceledCommandInput, context: CommandContext): Promise<RecordPaymentCanceledCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_CANCELED", command: "RecordPaymentCanceledCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordPaymentCanceledCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordPaymentCanceledCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordPaymentCanceledCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordPaymentCanceledCommandDTO { return mutationResult as RecordPaymentCanceledCommandDTO; }
  async run(input: RecordPaymentCanceledCommandInput, context: CommandContext): Promise<CommandResult<RecordPaymentCanceledCommandDTO>> { return runGovernedCommand(this, input, context); }
}
