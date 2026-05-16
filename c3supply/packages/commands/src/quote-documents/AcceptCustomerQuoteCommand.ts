import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AcceptCustomerQuoteCommandInput { quoteDocumentId: string; acceptedBy: string; termsAccepted: boolean; quoteExpired: boolean; shareLinkValid: boolean; }
export interface AcceptCustomerQuoteCommandDTO { id: string; workflow: "quote-document"; status: "CUSTOMER_ACCEPTED"; command: "AcceptCustomerQuoteCommand"; }

export class AcceptCustomerQuoteCommand implements GovernedCommand<AcceptCustomerQuoteCommandInput, AcceptCustomerQuoteCommandDTO> {
  validateInput(input: AcceptCustomerQuoteCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.acceptedBy) throw new Error("acceptedBy is required.");
    if (!input.termsAccepted) throw new Error("termsAccepted is required."); if (input.quoteExpired) throw new Error("expired quote cannot be accepted."); if (!input.shareLinkValid) throw new Error("valid share link is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: AcceptCustomerQuoteCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.accept"); }
  async executeMutation(input: AcceptCustomerQuoteCommandInput, context: CommandContext): Promise<AcceptCustomerQuoteCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "CUSTOMER_ACCEPTED", command: "AcceptCustomerQuoteCommand" }; }
  async appendAuditEvent(actor: Actor, input: AcceptCustomerQuoteCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AcceptCustomerQuoteCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "AcceptCustomerQuoteCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): AcceptCustomerQuoteCommandDTO { return mutationResult as AcceptCustomerQuoteCommandDTO; }
  async run(input: AcceptCustomerQuoteCommandInput, context: CommandContext): Promise<CommandResult<AcceptCustomerQuoteCommandDTO>> { return runGovernedCommand(this, input, context); }
}
