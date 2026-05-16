import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RecordCustomerQuoteRevisionRequestCommandInput { quoteDeliveryId: string; requestedBy?: string; reason: string; }

export interface RecordCustomerQuoteRevisionRequestCommandDTO { id: string; workflow: "quote-delivery"; status: "REVISION_REQUESTED"; command: "RecordCustomerQuoteRevisionRequestCommand"; }

export class RecordCustomerQuoteRevisionRequestCommand implements GovernedCommand<RecordCustomerQuoteRevisionRequestCommandInput, RecordCustomerQuoteRevisionRequestCommandDTO> {
  validateInput(input: RecordCustomerQuoteRevisionRequestCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (!input.reason) throw new Error("reason is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordCustomerQuoteRevisionRequestCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.revision.record"); }
  async executeMutation(input: RecordCustomerQuoteRevisionRequestCommandInput, context: CommandContext): Promise<RecordCustomerQuoteRevisionRequestCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "REVISION_REQUESTED", command: "RecordCustomerQuoteRevisionRequestCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordCustomerQuoteRevisionRequestCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordCustomerQuoteRevisionRequestCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordCustomerQuoteRevisionRequestCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordCustomerQuoteRevisionRequestCommandDTO { return mutationResult as RecordCustomerQuoteRevisionRequestCommandDTO; }
  async run(input: RecordCustomerQuoteRevisionRequestCommandInput, context: CommandContext): Promise<CommandResult<RecordCustomerQuoteRevisionRequestCommandDTO>> { return runGovernedCommand(this, input, context); }
}
