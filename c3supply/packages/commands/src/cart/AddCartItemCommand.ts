import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AddCartItemCommandInput { cartId: string; productId: string; name: string; quantity: number; quoteRequired: boolean; checkoutEligible: boolean; }
export interface AddCartItemCommandDTO { id: string; workflow: "commerce-quote"; status: "CART_UPDATED"; command: "AddCartItemCommand"; }

export class AddCartItemCommand implements GovernedCommand<AddCartItemCommandInput, AddCartItemCommandDTO> {
  validateInput(input: AddCartItemCommandInput): void {
    if (!input.cartId) throw new Error("cartId is required.");
    if (!input.productId) throw new Error("productId is required.");
    if (!input.name) throw new Error("name is required.");
  }
  validateActor(actor: Actor): void { const result = requireActor(actor); if (!result.allowed) throw new Error(result.reason); }
  governanceGuard(actor: Actor, input: AddCartItemCommandInput): GovernanceResult { void input; return requirePermission(actor, "cart.item.add"); }
  async executeMutation(input: AddCartItemCommandInput, context: CommandContext): Promise<AddCartItemCommandDTO> { void context; return { id: input.cartId, workflow: "commerce-quote", status: "CART_UPDATED", command: "AddCartItemCommand" }; }
  async appendAuditEvent(actor: Actor, input: AddCartItemCommandInput, mutationResult: unknown, context: CommandContext): Promise<void> {
    const result = mutationResult as AddCartItemCommandDTO;
    await appendAudit({ id: crypto.randomUUID(), actorId: actor.id, actorRole: actor.role, action: "AddCartItemCommand", workflow: "commerce-quote", entityId: result.id, requestId: context.requestId, createdAt: new Date().toISOString(), metadata: { input } }, context.audit);
  }
  returnSafeDTO(mutationResult: unknown): AddCartItemCommandDTO { return mutationResult as AddCartItemCommandDTO; }
  async run(input: AddCartItemCommandInput, context: CommandContext): Promise<CommandResult<AddCartItemCommandDTO>> { return runGovernedCommand(this, input, context); }
}
