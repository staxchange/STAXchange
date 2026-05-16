import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface UpdateCartItemQuantityCommandInput { cartId: string; itemId: string; quantity: number; }
export interface UpdateCartItemQuantityCommandDTO { id: string; workflow: "commerce-quote"; status: "CART_UPDATED"; command: "UpdateCartItemQuantityCommand"; }

export class UpdateCartItemQuantityCommand implements GovernedCommand<UpdateCartItemQuantityCommandInput, UpdateCartItemQuantityCommandDTO> {
  validateInput(input: UpdateCartItemQuantityCommandInput): void {
    if (!input.cartId) throw new Error("cartId is required.");
    if (!input.itemId) throw new Error("itemId is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: UpdateCartItemQuantityCommandInput): GovernanceResult { void input; return requirePermission(actor, "cart.item.update"); }
  async executeMutation(input: UpdateCartItemQuantityCommandInput, context: CommandContext): Promise<UpdateCartItemQuantityCommandDTO> { void context; return { id: input.cartId, workflow: "commerce-quote", status: "CART_UPDATED", command: "UpdateCartItemQuantityCommand" }; }
  async appendAuditEvent(actor: Actor, input: UpdateCartItemQuantityCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as UpdateCartItemQuantityCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "UpdateCartItemQuantityCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): UpdateCartItemQuantityCommandDTO { return mutationResult as UpdateCartItemQuantityCommandDTO; }
  async run(input: UpdateCartItemQuantityCommandInput, context: CommandContext): Promise<CommandResult<UpdateCartItemQuantityCommandDTO>> { return runGovernedCommand(this, input, context); }
}
