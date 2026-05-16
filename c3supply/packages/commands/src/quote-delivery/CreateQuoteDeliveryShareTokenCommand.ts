import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";


export interface CreateQuoteDeliveryShareTokenCommandInput { quoteDeliveryId: string; tokenHash: string; expiresAt: string; }

export interface CreateQuoteDeliveryShareTokenCommandDTO { id: string; workflow: "quote-delivery"; status: "SHARE_LINK_READY"; command: "CreateQuoteDeliveryShareTokenCommand"; }

export class CreateQuoteDeliveryShareTokenCommand implements GovernedCommand<CreateQuoteDeliveryShareTokenCommandInput, CreateQuoteDeliveryShareTokenCommandDTO> {
  validateInput(input: CreateQuoteDeliveryShareTokenCommandInput): void {
    if (!input.quoteDeliveryId) throw new Error("quoteDeliveryId is required.");
    if (!input.tokenHash) throw new Error("tokenHash is required.");
    if (!input.expiresAt) throw new Error("expiresAt is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: CreateQuoteDeliveryShareTokenCommandInput): GovernanceResult { void input; return requirePermission(actor, "quote_delivery.share_token.create"); }
  async executeMutation(input: CreateQuoteDeliveryShareTokenCommandInput, context: CommandContext): Promise<CreateQuoteDeliveryShareTokenCommandDTO> {
    void context;
    return { id: input.quoteDeliveryId, workflow: "quote-delivery", status: "SHARE_LINK_READY", command: "CreateQuoteDeliveryShareTokenCommand" };
  }
  async appendAuditEvent(actor: Actor, input: CreateQuoteDeliveryShareTokenCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as CreateQuoteDeliveryShareTokenCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "CreateQuoteDeliveryShareTokenCommand", workflow: "quote-delivery", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): CreateQuoteDeliveryShareTokenCommandDTO { return mutationResult as CreateQuoteDeliveryShareTokenCommandDTO; }
  async run(input: CreateQuoteDeliveryShareTokenCommandInput, context: CommandContext): Promise<CommandResult<CreateQuoteDeliveryShareTokenCommandDTO>> { return runGovernedCommand(this, input, context); }
}
