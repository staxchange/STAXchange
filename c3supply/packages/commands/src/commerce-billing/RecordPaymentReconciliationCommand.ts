import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RecordPaymentReconciliationCommandInput { invoiceId: string; paymentId: string; reconciledBy: string; }
export interface RecordPaymentReconciliationCommandDTO { id: string; workflow: "commerce-billing"; status: "PAYMENT_RECONCILIATION_REQUIRED"; command: "RecordPaymentReconciliationCommand"; }
export class RecordPaymentReconciliationCommand implements GovernedCommand<RecordPaymentReconciliationCommandInput, RecordPaymentReconciliationCommandDTO> {
  validateInput(input: RecordPaymentReconciliationCommandInput): void {
    if (!(input as any).invoiceId) throw new Error("invoiceId is required.");
    if (!(input as any).paymentId) throw new Error("paymentId is required.");
    if (!(input as any).reconciledBy) throw new Error("reconciledBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordPaymentReconciliationCommandInput): GovernanceResult { void input; return requirePermission(actor, "commerce_payment.reconciliation.record"); }
  async executeMutation(input: RecordPaymentReconciliationCommandInput, context: CommandContext): Promise<RecordPaymentReconciliationCommandDTO> {
    void context;
    const entityId = (input as any).invoiceId ?? (input as any).handoffId ?? (input as any).billingPacketId ?? (input as any).quoteId ?? crypto.randomUUID();
    return { id: entityId, workflow: "commerce-billing", status: "PAYMENT_RECONCILIATION_REQUIRED", command: "RecordPaymentReconciliationCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordPaymentReconciliationCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordPaymentReconciliationCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordPaymentReconciliationCommand", workflow: "commerce-billing", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordPaymentReconciliationCommandDTO { return mutationResult as RecordPaymentReconciliationCommandDTO; }
  async run(input: RecordPaymentReconciliationCommandInput, context: CommandContext): Promise<CommandResult<RecordPaymentReconciliationCommandDTO>> { return runGovernedCommand(this, input, context); }
}
