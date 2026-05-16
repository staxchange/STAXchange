import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordPaymentSucceededCommandInput { paymentRequestId: string; stripePaymentIntentId?: string; stripeEventId?: string; }
export interface RecordPaymentSucceededCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_SUCCEEDED"; command: "RecordPaymentSucceededCommand"; }

export class RecordPaymentSucceededCommand implements GovernedCommand<RecordPaymentSucceededCommandInput, RecordPaymentSucceededCommandDTO> {
  validateInput(input: RecordPaymentSucceededCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordPaymentSucceededCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.succeeded.record"); }
  async executeMutation(input: RecordPaymentSucceededCommandInput, context: CommandContext): Promise<RecordPaymentSucceededCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_SUCCEEDED", command: "RecordPaymentSucceededCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordPaymentSucceededCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordPaymentSucceededCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordPaymentSucceededCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordPaymentSucceededCommandDTO { return mutationResult as RecordPaymentSucceededCommandDTO; }
  async run(input: RecordPaymentSucceededCommandInput, context: CommandContext): Promise<CommandResult<RecordPaymentSucceededCommandDTO>> { return runGovernedCommand(this, input, context); }
}
