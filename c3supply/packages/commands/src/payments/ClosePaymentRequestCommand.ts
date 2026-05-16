import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface ClosePaymentRequestCommandInput { paymentRequestId: string; closedBy: string; }
export interface ClosePaymentRequestCommandDTO { id: string; workflow: "payments"; status: "PAYMENT_CLOSED"; command: "ClosePaymentRequestCommand"; }

export class ClosePaymentRequestCommand implements GovernedCommand<ClosePaymentRequestCommandInput, ClosePaymentRequestCommandDTO> {
  validateInput(input: ClosePaymentRequestCommandInput): void {
    if (!input.paymentRequestId) throw new Error("paymentRequestId is required.");
    if (!input.closedBy) throw new Error("closedBy is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: ClosePaymentRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "payment.close"); }
  async executeMutation(input: ClosePaymentRequestCommandInput, context: CommandContext): Promise<ClosePaymentRequestCommandDTO> {
    void context;
    const anyInput = input as unknown as Record<string, unknown>;
    const id = String(anyInput.paymentRequestId ?? anyInput.quoteId ?? crypto.randomUUID());
    return { id, workflow: "payments", status: "PAYMENT_CLOSED", command: "ClosePaymentRequestCommand" };
  }
  async appendAuditEvent(actor: Actor, input: ClosePaymentRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as ClosePaymentRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "ClosePaymentRequestCommand", workflow: "payments", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): ClosePaymentRequestCommandDTO { return mutationResult as ClosePaymentRequestCommandDTO; }
  async run(input: ClosePaymentRequestCommandInput, context: CommandContext): Promise<CommandResult<ClosePaymentRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
