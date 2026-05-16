import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface RemoveCartItemCommandInput { cartId: string; itemId: string; }
export interface RemoveCartItemCommandDTO { id: string; workflow: "commerce-quote"; status: "CART_UPDATED"; command: "RemoveCartItemCommand"; }

export class RemoveCartItemCommand implements GovernedCommand<RemoveCartItemCommandInput, RemoveCartItemCommandDTO> {
  validateInput(input: RemoveCartItemCommandInput): void {
    if (!input.cartId) throw new Error("cartId is required.");
    if (!input.itemId) throw new Error("itemId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: RemoveCartItemCommandInput): GovernanceResult { void input; return requirePermission(actor, "cart.item.remove"); }
  async executeMutation(input: RemoveCartItemCommandInput, context: CommandContext): Promise<RemoveCartItemCommandDTO> { void context; return { id: input.cartId, workflow: "commerce-quote", status: "CART_UPDATED", command: "RemoveCartItemCommand" }; }
  async appendAuditEvent(actor: Actor, input: RemoveCartItemCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as RemoveCartItemCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "RemoveCartItemCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): RemoveCartItemCommandDTO { return mutationResult as RemoveCartItemCommandDTO; }
  async run(input: RemoveCartItemCommandInput, context: CommandContext): Promise<CommandResult<RemoveCartItemCommandDTO>> { return runGovernedCommand(this, input, context); }
}
