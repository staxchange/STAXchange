import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface CreateOrderFromCustomerAcceptanceCommandInput { quoteDocumentId: string; acceptanceId: string; customerAccepted: boolean; createdBy: string; }
export interface CreateOrderFromCustomerAcceptanceCommandDTO { id: string; workflow: "quote-document"; status: "ORDER_CREATED"; command: "CreateOrderFromCustomerAcceptanceCommand"; }

export class CreateOrderFromCustomerAcceptanceCommand implements GovernedCommand<CreateOrderFromCustomerAcceptanceCommandInput, CreateOrderFromCustomerAcceptanceCommandDTO> {
  validateInput(input: CreateOrderFromCustomerAcceptanceCommandInput): void {
    if (!input.quoteDocumentId) throw new Error("quoteDocumentId is required.");
    if (!input.acceptanceId) throw new Error("acceptanceId is required.");
    if (!input.createdBy) throw new Error("createdBy is required.");
    if (!input.customerAccepted) throw new Error("customerAccepted is required before order creation.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateOrderFromCustomerAcceptanceCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_document.order.create"); }
  async executeMutation(input: CreateOrderFromCustomerAcceptanceCommandInput, context: CommandContext): Promise<CreateOrderFromCustomerAcceptanceCommandDTO> { void context; return { id: "quoteDocumentId" in input ? input.quoteDocumentId : crypto.randomUUID(), workflow: "quote-document", status: "ORDER_CREATED", command: "CreateOrderFromCustomerAcceptanceCommand" }; }
  async appendAuditEvent(actor: Actor, input: CreateOrderFromCustomerAcceptanceCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateOrderFromCustomerAcceptanceCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateOrderFromCustomerAcceptanceCommand", workflow: "quote-document", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateOrderFromCustomerAcceptanceCommandDTO { return mutationResult as CreateOrderFromCustomerAcceptanceCommandDTO; }
  async run(input: CreateOrderFromCustomerAcceptanceCommandInput, context: CommandContext): Promise<CommandResult<CreateOrderFromCustomerAcceptanceCommandDTO>> { return runGovernedCommand(this, input, context); }
}
