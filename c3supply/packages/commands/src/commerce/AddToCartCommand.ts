import { appendAuditEvent as appendAudit } from "@stax/audit";
import { requireActor, requirePermission, type Actor, type GovernanceResult } from "@stax/governance";
import type { CommandContext, GovernedCommand } from "../command-contract";
import type { CommandResult } from "../command-result";
import { runGovernedCommand } from "../internal/run-command";

export interface AddToCartCommandInput {
  cartId: string;
  productId: string;
  quantity: number;
  note?: string;
}

export interface AddToCartCommandDTO {
  id: string;
  workflow: "checkout";
  status: "ACTIVE";
  command: "AddToCartCommand";
}

export class AddToCartCommand implements GovernedCommand<AddToCartCommandInput, AddToCartCommandDTO> {
  validateInput(input: AddToCartCommandInput): void {
    if (!input) throw new Error("Input is required.");
    if (!input.cartId) throw new Error("cartId is required.");
  }

  validateActor(actor: Actor): void {
    const result = requireActor(actor);
    if (!result.allowed) throw new Error(result.reason);
  }

  governanceGuard(actor: Actor, input: AddToCartCommandInput): GovernanceResult {
    void input;
    return requirePermission(actor, "commerce.cart");
  }

  async executeMutation(input: AddToCartCommandInput, context: CommandContext): Promise<AddToCartCommandDTO> {
    void context;
    // Placeholder only. Production mutation belongs here and nowhere in apps/*.
    return {
      id: String(input.cartId),
      workflow: "checkout",
      status: "ACTIVE",
      command: "AddToCartCommand"
    };
  }

  async appendAuditEvent(
    actor: Actor,
    input: AddToCartCommandInput,
    mutationResult: unknown,
    context: CommandContext
  ): Promise<void> {
    await appendAudit(
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        actorId: actor.id,
        actorRole: actor.role,
        action: "AddToCartCommand",
        workflow: "checkout",
        entityId: String(input.cartId),
        requestId: context.requestId,
        createdAt: new Date().toISOString(),
        metadata: { input, mutationResult }
      },
      context.audit
    );
  }

  returnSafeDTO(mutationResult: unknown): AddToCartCommandDTO {
    const result = mutationResult as AddToCartCommandDTO;
    return {
      id: result.id,
      workflow: "checkout",
      status: "ACTIVE",
      command: "AddToCartCommand"
    };
  }

  async run(input: AddToCartCommandInput, context: CommandContext): Promise<CommandResult<AddToCartCommandDTO>> {
    return runGovernedCommand(this, input, context);
  }
}
