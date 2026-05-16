import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface RecordCustomerQuoteAcceptanceCommandInput { quoteDeliveryId: string; tokenHash?: string; actorId?: string; acceptedTerms: true; }

export interface RecordCustomerQuoteAcceptanceCommandDTO { id: string; workflow: "quote-delivery"; status: "CUSTOMER_ACCEPTED"; command: "RecordCustomerQuoteAcceptanceCommand"; }

export class RecordCustomerQuoteAcceptanceCommand implements GovernedCommand<RecordCustomerQuoteAcceptanceCommandInput, RecordCustomerQuoteAcceptanceCommandDTO> {
  validateInput(input: RecordCustomerQuoteAcceptanceCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (input.acceptedTerms !== true) throw new Error("acceptedTerms must be true.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RecordCustomerQuoteAcceptanceCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.accept.record"); }
  async executeMutation(input: RecordCustomerQuoteAcceptanceCommandInput, context: CommandContext): Promise<RecordCustomerQuoteAcceptanceCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "CUSTOMER_ACCEPTED", command: "RecordCustomerQuoteAcceptanceCommand" };
  }
  async appendAuditEvent(actor: Actor, input: RecordCustomerQuoteAcceptanceCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RecordCustomerQuoteAcceptanceCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RecordCustomerQuoteAcceptanceCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RecordCustomerQuoteAcceptanceCommandDTO { return mutationResult as RecordCustomerQuoteAcceptanceCommandDTO; }
  async run(input: RecordCustomerQuoteAcceptanceCommandInput, context: CommandContext): Promise<CommandResult<RecordCustomerQuoteAcceptanceCommandDTO>> { return runGovernedCommand(this, input, context); }
}
