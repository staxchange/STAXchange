import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RecordCustomerQuoteViewCommandInput { quoteDeliveryId: string; tokenHash?: string; actorId?: string; }

export interface RecordCustomerQuoteViewCommandDTO { id: string; workflow: "quote-delivery"; status: "QUOTE_VIEWED"; command: "RecordCustomerQuoteViewCommand"; }

export class RecordCustomerQuoteViewCommand implements GovernedCommand<RecordCustomerQuoteViewCommandInput, RecordCustomerQuoteViewCommandDTO> {
  validateInput(input: RecordCustomerQuoteViewCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordCustomerQuoteViewCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.view.record"); }
  async executeMutation(input: RecordCustomerQuoteViewCommandInput, context: CommandContext): Promise<RecordCustomerQuoteViewCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "QUOTE_VIEWED", command: "RecordCustomerQuoteViewCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordCustomerQuoteViewCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordCustomerQuoteViewCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordCustomerQuoteViewCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordCustomerQuoteViewCommandDTO { return mutationResult as RecordCustomerQuoteViewCommandDTO; }
  async run(input: RecordCustomerQuoteViewCommandInput, context: CommandContext): Promise<CommandResult<RecordCustomerQuoteViewCommandDTO>> { return runGovernedCommand(this, input, context); }
}
